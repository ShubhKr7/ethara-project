import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { PrismaClient, UserRole } from "@prisma/client";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "MEMBER"]).default("MEMBER"),
  joinCode: z.string().optional(),
});

// Helper to generate a unique join code
function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { email, password, name, role, joinCode } = parsed.data;

    // If member, verify join code first before transaction
    let targetOrganization = null;
    if (role === "MEMBER" && joinCode) {
      targetOrganization = await prisma.organization.findUnique({
        where: { joinCode: joinCode.toUpperCase() },
      });
      if (!targetOrganization) {
        return NextResponse.json(
          { message: "Invalid join code" },
          { status: 400 }
        );
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // We use a transaction so that if Org creation fails, the User isn't created (and vice versa)
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the User
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role as UserRole,
        },
      });

      // 2. If Admin, create their first Organization automatically
      if (role === "ADMIN") {
        await tx.organization.create({
          data: {
            name: `${name}'s Organization`,
            joinCode: generateJoinCode(),
            adminId: user.id,
            members: {
              create: {
                userId: user.id,
              }
            }
          },
        });
      }
      
      // 3. If Member and has valid join code, add to Organization
      if (role === "MEMBER" && targetOrganization) {
        await tx.orgMember.create({
          data: {
            userId: user.id,
            organizationId: targetOrganization.id,
          }
        });
      }

      return user;
    });

    // Exclude password from the response
    const { password: _, ...rest } = result;

    return NextResponse.json(
      { user: rest, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}