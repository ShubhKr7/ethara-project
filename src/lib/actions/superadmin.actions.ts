"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

// Helper to generate a unique join code
function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function getSuperAdminSession() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }
  return session;
}

export async function getAllOrganizations() {
  await getSuperAdminSession();
  return prisma.organization.findMany({
    include: {
      admin: { select: { name: true, email: true } },
      _count: { select: { members: true, projects: true } },
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createOrganization(formData: FormData) {
  const session = await getSuperAdminSession();
  const name = formData.get("name") as string;
  const adminEmail = formData.get("adminEmail") as string;
  const adminPassword = formData.get("adminPassword") as string;
  const adminName = formData.get("adminName") as string;

  if (!name?.trim() || !adminEmail?.trim() || !adminPassword?.trim() || !adminName?.trim()) {
    throw new Error("All fields are required");
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail.trim() }
  });

  if (existingUser) {
    throw new Error("User with that email already exists");
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.$transaction(async (tx) => {
    // 1. Create the Admin user
    const adminUser = await tx.user.create({
      data: {
        name: adminName.trim(),
        email: adminEmail.trim(),
        password: hashedPassword,
        role: "ADMIN"
      }
    });

    // 2. Create Organization
    await tx.organization.create({
      data: {
        name: name.trim(),
        joinCode: generateJoinCode(),
        adminId: adminUser.id,
        members: {
          create: {
            userId: adminUser.id,
          }
        }
      },
    });
  });

  revalidatePath("/superadmin");
}

export async function getOrganizationDetails(id: string) {
  await getSuperAdminSession();
  
  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      admin: { select: { id: true, name: true, email: true, createdAt: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true, role: true, createdAt: true } } },
        orderBy: { user: { createdAt: 'desc' } }
      },
      projects: {
        include: {
          _count: { select: { tasks: true } }
        }
      }
    }
  });

  if (!org) redirect("/superadmin");
  return org;
}

export async function deleteUser(userId: string) {
  await getSuperAdminSession();

  // Ensure they don't delete themselves
  const session = await auth();
  if (session?.user?.id === userId) {
    throw new Error("You cannot delete yourself.");
  }

  // Find user to check if they are an admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { ownedOrganizations: true }
  });

  if (!user) throw new Error("User not found");

  if (user.ownedOrganizations.length > 0) {
    throw new Error("This user is the Admin of an Organization. You must reassign or delete the Organization first.");
  }

  await prisma.user.delete({
    where: { id: userId }
  });

  revalidatePath("/superadmin/organizations/[id]", "page");
}

export async function getSuperAdminProjectById(id: string) {
  await getSuperAdminSession();

  if (!id) {
    redirect("/superadmin");
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      tasks: {
        include: {
          assignee: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) redirect("/superadmin");
  return project;
}

export async function createOrgMemberBySuperAdmin(formData: FormData, orgId: string) {
  await getSuperAdminSession();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    throw new Error("All fields are required");
  }

  const org = await prisma.organization.findUnique({
    where: { id: orgId }
  });

  if (!org) {
    throw new Error("Organization not found");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.trim() }
  });

  if (existingUser) {
    throw new Error("User with that email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        role: "MEMBER"
      }
    });

    await tx.orgMember.create({
      data: {
        userId: newUser.id,
        organizationId: org.id
      }
    });
  });

  revalidatePath(`/superadmin/organizations/${orgId}`);
}
