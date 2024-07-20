import { EmailCodeInputType, LoginUserInputType, RegisterUserInputType } from "~/lib/schema";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { sendEmail } from "~/lib/mailer";
import { db } from "~/server/db";

type RegisterUserInputProps = {
  input: RegisterUserInputType;
};

type LoginUserInputProps = {
  input: LoginUserInputType;
};

type VerifyTokenProps = {
  input: EmailCodeInputType
};

export const registerUserHandler = async ({
  input,
}: RegisterUserInputProps) => {
  try {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const newUser = {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    };

    const user = await db.user.create({
      data: newUser,
    });

    await sendEmail({ email: input.email, userId: user.id });

    const { password, ...userWithoutPassword } = user;

    return {
      status: "success",
      data: {
        user: userWithoutPassword,
      },
    };
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email already exists",
      });
    }
    throw err;
  }
};

export const loginUserHandler = async ({ input }: LoginUserInputProps) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email: input.email,
      },
    });
    if (!user || !(await bcrypt.compare(input.password, user.password))) {
      throw new TRPCError({
        message: "Invalid email or password",
        code: "BAD_REQUEST",
      });
    }

    const secret = env.JWT_SECRET;
    const token = jwt.sign({ sub: user.id }, secret, {
      expiresIn: 60 * 60,
    });

    const cookieOpts = {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60,
    };

    cookies().set("token", token, cookieOpts);

    return {
      status: "success",
      token,
    };
  } catch (err: any) {
    throw err;
  }
};

export const logoutHandler = async () => {
  try {
    cookies().set("token", "", {
      maxAge: -1,
    });
  } catch (err: any) {
    throw err;
  }
};

export const verifyEmailCodeHandler = async ({ input }: VerifyTokenProps) => {
  try {
    const user = await db.user.findFirst({
      where: {
        verifyToken: input.code,
      },
    });

    if (!user) {
      return new TRPCError({
        message: "Invalid token",
        code: "BAD_REQUEST",
      });
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        verified: true,
      },
    });

    return {
      status: "success",
      message: "Code Verified",
    };
  } catch (err: any) {
    throw new TRPCError({
      message: err.message,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};
