"use client";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { UserCategoryType } from "~/lib/schema";
import { PLACEHOLDER_PAGES, getPageRange } from "~/lib/utils";
import { trpc } from "~/trpc/trpc";
import CategoryList from "../ui/category-list";
import Pagination from "../ui/pagination";

const CategorySelectionForm = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fetchCategoryStats, setFetchCategoryStats] = useState(false);
  const [fetchUserCategories, setFetchUserCategories] = useState(false);
  const [categoryChanges, setCategoryChanges] = useState<UserCategoryType>({});
  const { data, isLoading } = trpc.getCategories.useQuery({
    page: currentPage,
    pageSize: 6,
  });
  const { data: categoryStats, isLoading: isStatsLoading } =
    trpc.getCategoriesCount.useQuery(undefined, {
      enabled: fetchCategoryStats,
    });

  const { data: userCategoryData, isLoading: isUserCategoryDataLoading } =
    trpc.getUserCategories.useQuery(undefined, {
      enabled: fetchUserCategories,
    });

  const totalPages = categoryStats ? categoryStats.totalPages : 0;
  const visiblePageNumbers = totalPages
    ? getPageRange(totalPages, currentPage)
    : PLACEHOLDER_PAGES;

  const { mutate: updateUserCategoriesHandler } =
    trpc.updateUserCategories.useMutation({
      onError(error) {
        toast.error("Something Happened, could not update interests!");
        console.log("Error Message", error.message);
      },
      onSuccess() {
        toast.success("Updated Your Interests");
      },
    });

  const debouncedUpdateCategories = useCallback(
    debounce(async (categoryChanges) => {
      updateUserCategoriesHandler(categoryChanges);
    }, 1500),
    [],
  );

  useEffect(() => {
    setFetchCategoryStats(true);
    setFetchUserCategories(true);
  }, []);

  useEffect(() => {
    if (Object.keys(categoryChanges).length > 0) {
      debouncedUpdateCategories(categoryChanges);
    }
  }, [categoryChanges, debouncedUpdateCategories]);

  const handleCategoryToggle = async (
    categoryId: string,
    isChecked: boolean,
  ) => {
    setCategoryChanges((prevChanges: any) => ({
      ...prevChanges,
      [categoryId]: isChecked,
    }));
  };

  const mergedUserCategories = useMemo(() => {
    if (userCategoryData) {
      return { ...userCategoryData.userCategoryMap, ...categoryChanges };
    }
  }, [userCategoryData, categoryChanges]);

  return (
    <div className="bg-ct-dark-200 mx-auto flex w-full max-w-md flex-col items-center justify-center gap-1 space-y-5 overflow-hidden rounded-xl border p-4">
      <h1 className="text-2xl font-semibold">Please mark your interests!</h1>
      <p className="text-center">We will keep you notified.</p>
      {data && mergedUserCategories && (
        <CategoryList
          categories={data.categories}
          userCategories={mergedUserCategories}
          isLoading={isLoading}
          handleCategoryToggle={handleCategoryToggle}
        />
      )}
      <Pagination
        visiblePageNumbers={visiblePageNumbers}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        isStatsLoading={isStatsLoading}
      />
    </div>
  );
};

export default CategorySelectionForm;
