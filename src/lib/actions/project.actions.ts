"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session;
}

export async function createProject(formData: FormData) {
  const session = await getSession();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name?.trim()) throw new Error("Project name is required");

  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      ownerId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
          role: "ADMIN",
        },
      },
    },
  });

  // Revalidate the dashboard layout to update the sidebar project list
  revalidatePath("/dashboard", "layout");
  return { id: project.id };
}

export async function updateProject(id: string, data: { name?: string; description?: string }) {
  const session = await getSession();

  await prisma.project.updateMany({
    where: {
      id,
      members: { some: { userId: session.user.id, role: "ADMIN" } },
    },
    data: {
      ...(data.name?.trim() && { name: data.name.trim() }),
      description: data.description?.trim() ?? null,
    },
  });

  revalidatePath("/dashboard", "layout");
  revalidatePath(`/dashboard/projects/${id}`);
}

export async function getMyProjects() {
  const session = await getSession();

  return prisma.project.findMany({
    where: {
      members: { some: { userId: session.user.id } },
    },
    include: {
      owner: { select: { id: true, name: true, image: true } },
      members: { include: { user: { select: { id: true, name: true, image: true } } } },
      tasks: { select: { status: true } },
      _count: { select: { tasks: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProjectById(id: string) {
  const session = await getSession();

  if (!id) {
    console.error("getProjectById called without an ID");
    redirect("/dashboard/projects");
  }

  const project = await prisma.project.findFirst({
    where: {
      id,
      members: { some: { userId: session.user.id } },
    },
    include: {
      owner: { select: { id: true, name: true, image: true } },
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

  if (!project) redirect("/dashboard/projects");
  return project;
}

export async function deleteProject(id: string) {
  const session = await getSession();

  await prisma.project.deleteMany({
    where: { id, ownerId: session.user.id },
  });

  revalidatePath("/dashboard", "layout");
  // Return success — client will animate then redirect
  return { success: true };
}
