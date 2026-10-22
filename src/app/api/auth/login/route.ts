import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createSessionToken, SessionUser, UserRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password, role } = body;

    let user: SessionUser | null = null;

    // 1. Quick demo switch mode (for instant tester convenience)
    if (role && !identifier) {
      if (role === "MEMBER") {
        const member = await prisma.member.findFirst({ where: { status: "ACTIVE" } });
        if (!member) return NextResponse.json({ error: "No active member found" }, { status: 404 });
        user = {
          id: member.id,
          email: member.email,
          name: member.fullName,
          role: "MEMBER",
          memberId: member.id,
          memberNo: member.memberNo,
          category: member.category,
        };
      } else {
        const staff = await prisma.staffUser.findFirst({ where: { role } });
        if (!staff) return NextResponse.json({ error: `Staff role ${role} not found` }, { status: 404 });
        user = {
          id: staff.id,
          email: staff.email,
          name: staff.name,
          role: staff.role as UserRole,
        };
      }
    } else {
      // 2. Real credential check
      if (!identifier || !password) {
        return NextResponse.json({ error: "Identifier (Email or Member No) and Password are required." }, { status: 400 });
      }

      // Check staff first
      const staff = await prisma.staffUser.findFirst({
        where: { email: identifier.trim().toLowerCase() },
      });

      if (staff) {
        const matches = await comparePassword(password, staff.passwordHash);
        if (!matches) {
          return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }
        user = {
          id: staff.id,
          email: staff.email,
          name: staff.name,
          role: staff.role as UserRole,
        };
      } else {
        // Check member
        const member = await prisma.member.findFirst({
          where: {
            OR: [
              { email: identifier.trim().toLowerCase() },
              { memberNo: identifier.trim() },
            ],
          },
        });

        if (!member) {
          return NextResponse.json({ error: "Account not found with this identifier." }, { status: 401 });
        }

        const validPassword = member.passwordHash
          ? await comparePassword(password, member.passwordHash)
          : password === "Member@123";

        if (!validPassword) {
          return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
        }

        user = {
          id: member.id,
          email: member.email,
          name: member.fullName,
          role: "MEMBER",
          memberId: member.id,
          memberNo: member.memberNo,
          category: member.category,
        };
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Authentication failed." }, { status: 401 });
    }

    const token = await createSessionToken(user);
    const response = NextResponse.json({ success: true, user });

    response.cookies.set("library_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
