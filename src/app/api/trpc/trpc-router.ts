import AuthRouter from "~/server/api/routers/auth.router";
import CategoryRouter from "~/server/api/routers/category.router";
import HealthCheckerRouter from "~/server/api/routers/health.router";
import UserRouter from "~/server/api/routers/user.router";
import { createTRPCContext } from "~/trpc/trpc-context";
import { t } from "~/trpc/trpc-server";


export const appRouter = t.mergeRouters(
  HealthCheckerRouter,
  AuthRouter,
  CategoryRouter,
  UserRouter
);

export const createCaller = t.createCallerFactory(appRouter);

export const createAsyncCaller = async () => {
  const context = await createTRPCContext();
  return createCaller(context);
};

export type AppRouter = typeof appRouter;
