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

  const orgMember = await prisma.orgMember.findFirst({
    where: { userId: session.user.id },
  });

  if (!orgMember) {
    throw new Error("You must belong to an organization to create a project.");
  }

  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      organizationId: orgMember.organizationId,
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
    where: { 
      id, 
      members: { some: { userId: session.user.id, role: "ADMIN" } } 
    },
  });

  revalidatePath("/dashboard", "layout");
  // Return success — client will animate then redirect
  return { success: true };
}

export async function getOrganizationMembers() {
  const session = await getSession();
  
  const orgMember = await prisma.orgMember.findFirst({
    where: { userId: session.user.id },
    include: {
      organization: {
        include: {
          members: {
            include: { user: { select: { id: true, name: true, email: true, role: true } } }
          }
        }
      }
    }
  });

  if (!orgMember) return [];
  return orgMember.organization.members;
}

export async function assignUserToProject(projectId: string, userId: string) {
  const session = await getSession();

  // Verify the current user is an ADMIN of the project
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      members: { some: { userId: session.user.id, role: "ADMIN" } }
    }
  });

  if (!project) throw new Error("Unauthorized");

  // Check if user is already in project
  const existingMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId
      }
    }
  });

  if (!existingMember) {
    await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: "MEMBER"
      }
    });
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard", "layout");
}

export async function getDashboardTaskStats() {
  const session = await getSession();
  const now = new Date();

  const projects = await prisma.project.findMany({
    where: {
      members: { some: { userId: session.user.id } },
    },
    select: {
      name: true,
      tasks: {
        select: {
          id: true,
          title: true,
          status: true,
          dueDate: true,
          assignee: { select: { id: true, name: true } },
        },
      },
    },
  });

  const allTasks = projects.flatMap((p) =>
    p.tasks.map((t) => ({ ...t, projectName: p.name }))
  );

  const byStatus = {
    TODO: allTasks.filter((t) => t.status === "TODO").length,
    IN_PROGRESS: allTasks.filter((t) => t.status === "IN_PROGRESS").length,
    DONE: allTasks.filter((t) => t.status === "DONE").length,
  };

  const overdueTasks = allTasks
    .filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "DONE"
    )
    .sort(
      (a, b) =>
        new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    )
    .slice(0, 6)
    .map((t) => ({
      id: t.id,
      title: t.title,
      projectName: t.projectName,
      dueDate: t.dueDate!.toISOString(),
      status: t.status,
    }));

  const userMap: Record<string, { name: string; count: number }> = {};
  for (const task of allTasks) {
    if (task.assignee) {
      const key = task.assignee.id;
      if (!userMap[key]) {
        userMap[key] = { name: task.assignee.name ?? "Unknown", count: 0 };
      }
      userMap[key].count++;
    }
  }

  const tasksPerUser = Object.values(userMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    total: allTasks.length,
    byStatus,
    overdueTasks,
    tasksPerUser,
  };
}

export async function removeUserFromProject(projectId: string, userId: string) {
  const session = await getSession();

  // Verify the current user is an ADMIN of the project
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      members: { some: { userId: session.user.id, role: "ADMIN" } }
    }
  });

  if (!project) throw new Error("Unauthorized to remove members from this project");

  // Prevent admin from removing themselves if they are the only admin
  if (session.user.id === userId) {
    const adminCount = await prisma.projectMember.count({
      where: { projectId, role: "ADMIN" }
    });
    if (adminCount <= 1) {
      throw new Error("Cannot remove the only admin from the project");
    }
  }

  await prisma.projectMember.delete({
    where: {
      projectId_userId: {
        projectId,
        userId
      }
    }
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard", "layout");
}
