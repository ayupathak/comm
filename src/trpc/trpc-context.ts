import { deserializeUser } from "~/server/middleware/auth-middleware";
import { headers } from "next/headers";

export const createTRPCContext = async () => {
    const user = await deserializeUser()
    const heads = new Headers(headers());
    heads.set("x-trpc-source", "rsc");
  
    return {
        user,
        headers: heads
    }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
