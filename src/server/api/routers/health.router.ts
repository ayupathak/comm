import { t, publicProcedure } from "~/trpc/trpc-server";
import { getHealth } from "../controllers/health.controller";

const HealthCheckerRouter = t.router({
  healthchecker: publicProcedure.query(getHealth),
});

export default HealthCheckerRouter;
