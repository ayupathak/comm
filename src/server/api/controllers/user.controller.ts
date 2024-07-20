import { TRPCError } from "@trpc/server";
import type { Context } from "~/trpc/trpc-context";

type GetAuthUserControllerProps = {
  ctx: Context;
};

export const getAuthUserHandler = ({ ctx }: GetAuthUserControllerProps) => {
  try {
    const user = ctx.user.user;
    return {
      status: "success",
      data: {
        user,
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
    });
  }
};
