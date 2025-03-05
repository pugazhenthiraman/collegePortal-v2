import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // ✅ Check if SuperAdmin exists
    const superAdmin = await prisma.superAdmin.findUnique({ where: { email } });

    if (!superAdmin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Validate Password
    const isValidPassword = await bcrypt.compare(password, superAdmin.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Password Incorrect" }, { status: 401 });
    }

    // ✅ Generate JWT Token
    const token = sign(
      { userId: superAdmin.id, role: superAdmin.role },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "1d" }
    );

    return NextResponse.json({ token, role: "SUPER_ADMIN" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
