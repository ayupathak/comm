import { protectedProcedure, t } from "~/trpc/trpc-server";
import { getAuthUserHandler } from "../controllers/user.controller";

const UserRouter = t.router({
  getMe: protectedProcedure.query(({ctx}) => getAuthUserHandler({ctx}))
});

export default UserRouter;
