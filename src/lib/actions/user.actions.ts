"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function updateProfile(data: { name: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  // Check if name is taken by someone else
  const existingUser = await prisma.user.findFirst({
    where: {
      name: { equals: data.name, mode: "insensitive" },
      id: { not: session.user.id }
    }
  });

  if (existingUser) {
    return { error: "This name is already taken" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: data.name }
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function forceLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("__Secure-next-auth.session-token");
  cookieStore.delete("authjs.session-token");
  cookieStore.delete("__Secure-authjs.session-token");
  redirect("/login");
}
