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

    // ✅ Check if College exists
    const college = await prisma.college.findUnique({ where: { email } });

    if (!college) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 🔥 Check if College is approved
    if (college.status !== "ACTIVE") {
      return NextResponse.json({ error: "College is not approved yet" }, { status: 403 });
    }

    // ✅ Validate Password
    const isValidPassword = await bcrypt.compare(password, college.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Generate JWT Token
    const token = sign(
      { userId: college.id, role: college.role },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "1d" }
    );

    return NextResponse.json({ token, role: college.role }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
