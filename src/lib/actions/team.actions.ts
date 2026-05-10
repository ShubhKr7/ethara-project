"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

async function getAdminSession() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return session;
}

export async function getMyOrganization() {
  const session = await getAdminSession();
  
  const org = await prisma.organization.findFirst({
    where: { adminId: session.user.id },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true, role: true } } }
      }
    }
  });

  return org;
}

export async function createTeamMember(formData: FormData) {
  const session = await getAdminSession();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    throw new Error("All fields are required");
  }

  const org = await prisma.organization.findFirst({
    where: { adminId: session.user.id }
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

  revalidatePath("/dashboard/team");
}
