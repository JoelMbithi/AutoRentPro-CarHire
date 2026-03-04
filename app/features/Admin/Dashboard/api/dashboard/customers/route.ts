import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Local enum (safe + explicit)
enum UserRole {
  CUSTOMER = "CUSTOMER",
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

/**
 * GET /api/dashboard/customers
 * Query params:
 *  - page
 *  - limit
 *  - search
 *  - role
 *  - status
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const role =
      (searchParams.get("role") as UserRole) || UserRole.CUSTOMER;
    const status = searchParams.get("status") || "active";

    const skip = (page - 1) * limit;

    const where: any = { role };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status === "verified") where.isVerified = true;
    if (status === "unverified") where.isVerified = false;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          userProfile: true,
          _count: { select: { bookings: true } },
          bookings: {
            select: { totalPrice: true, createdAt: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: users,
        meta: {
          total,
          page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch customers error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/dashboard/customers
 * Create new customer
 */
/* export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { firstName, lastName, email, phone, password, role, avatar, preferences } =
      body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: password || "temporary_password",
        role: role || UserRole.CUSTOMER,
      },
    });

    if (avatar || preferences) {
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          avatar,
          preferences,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Customer created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create customer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create customer" },
      { status: 500 }
    );
  }
} */
