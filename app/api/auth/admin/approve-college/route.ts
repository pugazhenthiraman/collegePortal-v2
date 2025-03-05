import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"; // ✅ Import JWT for manual verification

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    // ✅ Extract Bearer Token from Authorization Header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 });
    }

    // ✅ Get the token from the header
    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

    // ✅ Verify Token using NEXTAUTH_SECRET
    let decodedToken : any ;
    try {
      decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
    }

    // ✅ Only allow SUPER_ADMIN to approve/reject colleges
    if (decodedToken.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // ✅ Get request body
    const { collegeId, status, remark } = await req.json();

    // ✅ Validate request data
    if (!collegeId || !["ACTIVE", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // ✅ Check if the college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // ✅ Prevent re-approval or re-rejection
    if (college.status !== "PENDING") {
      return NextResponse.json({ error: `College is already ${college.status}` }, { status: 400 });
    }

    // ✅ Approve or Reject the college
    const updatedCollege = await prisma.college.update({
      where: { id: collegeId },
      data: { status, remark },
    });

    return NextResponse.json(
      { message: `College ${status.toLowerCase()} successfully`, college: updatedCollege },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error approving/rejecting college:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
