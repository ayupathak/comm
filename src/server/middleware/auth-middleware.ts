import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { cookies } from "next/headers";

export const deserializeUser = async () => {
  const cookieStore = cookies();
  try {
    let token;
    if (cookieStore.get('token')) {
      token = cookieStore.get('token')?.value;
    }

    const notAuthenticated = {
      user: null,
    };

    if (!token) {
      console.log('No token found');
      return notAuthenticated;
    }

    const secret = process.env.JWT_SECRET!;
    let decoded;
    try {
      decoded = jwt.verify(token, secret) as { sub: string };
    } catch (error) {
      console.log('JWT verification failed:', error);
      return notAuthenticated;
    }

    if (!decoded || !decoded.sub) {
      console.log('Decoded token is invalid:', decoded);
      return notAuthenticated;
    }

    const user = await db.user.findUnique({ where: { id: decoded.sub } });

    if (!user) {
      console.log('User not found for id:', decoded.sub);
      return notAuthenticated;
    }

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.log('Unexpected error:', errorMessage);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: errorMessage,
    });
  }
};
