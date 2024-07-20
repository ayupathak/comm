"use client";
import React from "react";
import { CategoryType, UserCategoryType } from "~/lib/schema";

type CategoryListProps = {
  categories: Array<CategoryType>;
  handleCategoryToggle: (categoryId: string, isChecked: boolean) => void;
  userCategories: Partial<UserCategoryType>;
  isLoading: boolean;
};

const CategoryList = ({
  categories,
  handleCategoryToggle,
  isLoading,
  userCategories,
}: CategoryListProps) => {
  if (isLoading)
    return (
      <div className=" flex flex-col items-center justify-center gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2 ">
            <div className="h-5 w-5 animate-pulse bg-slate-200" />
            <div className="h-5 w-[200px] animate-pulse bg-slate-300" />
          </div>
        ))}
      </div>
    );

  return (
    <div className=" flex flex-col justify-center gap-2">
      {categories.map((category) => (
        <div key={category.id} className="flex items-center gap-2 ">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer accent-black"
            checked={userCategories[category.id] === true}
            onChange={(e) =>
              handleCategoryToggle(category.id, e.target.checked)
            }
          />{" "}
          <span> {category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
