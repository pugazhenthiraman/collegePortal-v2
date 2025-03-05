import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // ✅ Ensure the request body is valid JSON
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    // ✅ Destructure and validate required fields
    const { 
      name, 
      email, 
      password, 
      address, 
      affiliated_university, 
      council_issuing_code, 
      deemed_university, 
      recognition_status, 
      superAdminId 
    } = body;

    if (!name || !email || !password || !deemed_university || !recognition_status || !superAdminId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Check if the email is already registered
    const existingCollege = await prisma.college.findUnique({ where: { email } });
    if (existingCollege) {
      return NextResponse.json({ error: "College with this email already exists" }, { status: 409 });
    }

    // ✅ Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create the College record
    const newCollege = await prisma.college.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        affiliated_university,
        council_issuing_code,
        deemed_university,
        recognition_status,
        superAdminId,
        status: "PENDING", // New college starts with pending approval
      },
    });

    return NextResponse.json(
      { message: "College registered successfully", college: newCollege },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error registering college:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
