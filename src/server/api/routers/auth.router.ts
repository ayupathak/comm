import {
  RegisterUserSchema,
  LoginUserSchema,
  EmailCodeSchema,
} from "~/lib/schema";
import { protectedProcedure, publicProcedure, t } from "~/trpc/trpc-server";
import {
  loginUserHandler,
  logoutHandler,
  registerUserHandler,
  verifyEmailCodeHandler,
} from "../controllers/auth.controller";

const AuthRouter = t.router({
  registerUser: publicProcedure
    .input(RegisterUserSchema)
    .mutation(registerUserHandler),
  loginUser: publicProcedure.input(LoginUserSchema).mutation(loginUserHandler),
  logoutUser: protectedProcedure.mutation(() => logoutHandler()),
  verifyCode: publicProcedure
    .input(EmailCodeSchema)
    .mutation(verifyEmailCodeHandler),
});

export default AuthRouter;
