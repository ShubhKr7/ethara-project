"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TaskStatus, TaskPriority } from "@prisma/client";

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session;
}

export async function createTask(data: {
  projectId: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assigneeId?: string;
}) {
  const session = await getSession();

  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId: data.projectId, userId: session.user.id } },
  });
  if (!membership) throw new Error("Not authorized");

  await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      priority: data.priority,
      status: data.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      projectId: data.projectId,
      assigneeId: data.assigneeId || null,
    },
  });

  revalidatePath(`/dashboard/projects/${data.projectId}`);
}

export async function updateTaskStatus(taskId: string, status: TaskStatus, projectId: string) {
  const session = await getSession();

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: { members: { some: { userId: session.user.id } } },
    },
  });
  if (!task) throw new Error("Task not found or not authorized");

  await prisma.task.update({ where: { id: taskId }, data: { status } });
  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function updateTask(
  taskId: string,
  data: {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: string | null;
    assigneeId?: string | null;
    projectId: string;
  }
) {
  const session = await getSession();

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: { members: { some: { userId: session.user.id } } },
    },
  });
  if (!task) throw new Error("Task not found or not authorized");

  await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priority && { priority: data.priority }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
      ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
    },
  });

  revalidatePath(`/dashboard/projects/${data.projectId}`);
}

export async function deleteTask(taskId: string, projectId: string) {
  const session = await getSession();

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: { members: { some: { userId: session.user.id } } },
    },
  });
  if (!task) throw new Error("Task not found or not authorized");

  await prisma.task.delete({ where: { id: taskId } });
  // revalidatePath(`/dashboard/projects/${projectId}`); // Handled by client for smoother animations
  return { success: true };
}
