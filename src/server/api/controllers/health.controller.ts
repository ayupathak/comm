import { TRPCError } from '@trpc/server';

export const getHealth = async () => {
  try {
    return {
      status: "success",
      message: "Healthy 😇",
    };
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err
    })
  }
};
