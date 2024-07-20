import { protectedProcedure, t } from "~/trpc/trpc-server";
import {
  getCategoryStats,
  getUserCategories as getUserCategoriesHandler,
  getPaginatedCategories,
  updateUserCategoryHandler,
} from "../controllers/category.controller";
import { PaginationInputSchema, UpdateUserCategorySchema } from "~/lib/schema";

const CategoryRouter = t.router({
  getCategories: protectedProcedure
    .input(PaginationInputSchema)
    .query(getPaginatedCategories),
  getCategoriesCount: protectedProcedure.query(getCategoryStats),
  getUserCategories: protectedProcedure.query(getUserCategoriesHandler),
  updateUserCategories: protectedProcedure
    .input(UpdateUserCategorySchema)
    .mutation(updateUserCategoryHandler),
});

export default CategoryRouter;
