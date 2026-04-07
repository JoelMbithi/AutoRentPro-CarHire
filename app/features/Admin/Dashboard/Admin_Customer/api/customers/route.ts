import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Local enum (safe + explicit)
enum UserRole {
  CUSTOMER = "CUSTOMER",
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const roleParam = searchParams.get("role") || "all";  // Changed: default to "all"
    const status = searchParams.get("status") || "active";

    const skip = (page - 1) * limit;

    // Build where clause - handle "all" case
    const where: any = {};
    
    // Only filter by role if a specific role is requested (not "all")
    if (roleParam !== "all") {
      where.role = roleParam as UserRole;
    }

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