import { TRPCError } from "@trpc/server";
import {
  PaginatedCategoryInputType,
  UpdateUserCategoryInputType,
  UserCategoryType,
} from "~/lib/schema";
import { db } from "~/server/db";
import { Context } from "~/trpc/trpc-context";

type GetCategoriesProps = {
  ctx: Context;
  input: PaginatedCategoryInputType;
};

type GetUserCategoriesProps = {
  ctx: Context;
};

type UpdateUserCategoryProps = {
  ctx: Context;
  input: UpdateUserCategoryInputType;
};

export const getPaginatedCategories = async ({
  ctx,
  input,
}: GetCategoriesProps) => {
  try {
    const { page, pageSize } = input;
    const skip = (page - 1) * pageSize;

    const categories = await db.category.findMany({
      skip,
      take: pageSize,
    });

    return {
      status: "success",
      currentPage: page,
      pageSize,
      categories,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err,
    });
  }
};

export const getCategoryStats = async () => {
  try {
    const totalCategories = await db.category.count();
    const totalPages = Math.ceil(totalCategories / 6);
    return {
      status: "success",
      totalPages,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err,
    });
  }
};

export const getUserCategories = async ({ ctx }: GetUserCategoriesProps) => {
  try {
    const userId = ctx.user.user?.id;

    const userCategories = await db.userCategory.findMany({
      where: { userId: userId },
    });
    let userCategoryMap: UserCategoryType = {};
    userCategoryMap = userCategories.reduce((map, item) => {
      map[item.categoryId] = true;
      return map;
    }, userCategoryMap);

    return {
      status: "success",
      userCategoryMap: userCategoryMap,
    };
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err,
    });
  }
};

export const updateUserCategoryHandler = async ({
  ctx,
  input,
}: UpdateUserCategoryProps) => {
  try {
    const categoriesToAdd: any = [];
    const categoriesToDelete: any = [];
    for (const [categoryId, add] of Object.entries(input)) {
      (add ? categoriesToAdd : categoriesToDelete).push(categoryId);
    }

    const existingCategories = await db.userCategory.findMany({
      where: {
        userId: ctx.user.user?.id,
        categoryId: { in: [...categoriesToAdd, ...categoriesToDelete] },
      },
    });

    const categoriesToUpsert = categoriesToAdd.filter(
      (categoryId: string) =>
        !existingCategories.some((cat) => cat.categoryId === categoryId),
    );
    const categoriesToActuallyDelete = existingCategories.filter((cat) =>
      categoriesToDelete.includes(cat.categoryId),
    );

    const addOrUpdateResults = await Promise.all(
      categoriesToUpsert.map((categoryId: string) =>
        db.userCategory.upsert({
          where: {
            userId_categoryId: { userId: ctx.user.user?.id!, categoryId },
          },
          update: {},
          create: { userId: ctx.user.user?.id!, categoryId },
        }),
      ),
    );
    const deleteResults = await Promise.all(
      categoriesToActuallyDelete.map((cat) =>
        db.userCategory.delete({
          where: {
            userId_categoryId: {
              userId: ctx.user.user?.id!,
              categoryId: cat.categoryId,
            },
          },
        }),
      ),
    );

    return {
      status: "success",
      addedOrUpdated: addOrUpdateResults,
      deleted: deleteResults,
    };
  } catch (err: any) {
    return {
      status: "error",
      message: "An internal server error occurred",
      errorDetails: err.message,
    };
  }
};
