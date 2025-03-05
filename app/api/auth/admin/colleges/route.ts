import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, CollegeStatus } from "@prisma/client";
import jwt from "jsonwebtoken"; // ✅ Import JWT for manual verification

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // ✅ Extract Bearer Token from Authorization Header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized - No token provided" }, { status: 401 });
    }

    // ✅ Get the token from the header
    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

    // ✅ Verify Token using NEXTAUTH_SECRET
    let decodedToken : any;
    try {
      decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
    }

    // ✅ Only allow SUPER_ADMIN access
    if (decodedToken.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // ✅ Get query parameters
    const url = new URL(req.url);
    const statusParam = url.searchParams.get("status")?.toUpperCase();
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    // ✅ Validate and convert status to Prisma Enum (CollegeStatus)
    let statusFilter = {};
    if (statusParam && Object.values(CollegeStatus).includes(statusParam as CollegeStatus)) {
      statusFilter = { status: statusParam as CollegeStatus };
    }

    // ✅ Get total count for pagination
    const totalColleges = await prisma.college.count({ where: statusFilter });

    // ✅ Fetch paginated colleges
    const colleges = await prisma.college.findMany({
      where: statusFilter,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        remark: true,
        createdAt: true,
      },
      skip: (page - 1) * limit, // ✅ Skip records based on pagination
      take: limit, // ✅ Limit records per page
      orderBy: { createdAt: "desc" }, // ✅ Sort by latest first
    });

    return NextResponse.json({
      colleges,
      page,
      limit,
      totalPages: Math.ceil(totalColleges / limit),
      totalColleges,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching colleges:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
