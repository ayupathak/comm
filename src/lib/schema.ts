import { TypeOf, boolean, number, object, record, string } from "zod";

export const RegisterUserSchema = object({
  name: string({ required_error: "Name is required" }).min(
    1,
    "Name is required",
  ),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid Email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 8 characters")
    .max(30, "Password must be less than 30 characters"),
});

export const LoginUserSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid Email"),
  password: string({ required_error: "Password is required" }).min(
    1,
    "Password is required",
  ),
});


export const PaginationInputSchema = object({
  page: number().min(1),
  pageSize: number().min(1),
});

export const CategorySchema = object({
  id: string(),
  name: string(),
});

export const AddToUserCategoriesSchema = object({
  categoryId: string(),
});

export const UpdateUserCategorySchema = record(string(), boolean());

export const EmailCodeSchema = object({
  code: string({ required_error: "Code is required" }).length(
    8,
    "OTP must be exactly 4 digits long",
  ),
});

export type RegisterUserInputType = TypeOf<typeof RegisterUserSchema>;
export type LoginUserInputType = TypeOf<typeof LoginUserSchema>;
export type PaginatedCategoryInputType = TypeOf<typeof PaginationInputSchema>;
export type EmailCodeInputType = TypeOf<typeof EmailCodeSchema>;
export type UpdateUserCategoryInputType = TypeOf<typeof UpdateUserCategorySchema>
export type UserCategoryType = TypeOf<typeof UpdateUserCategorySchema>
export type CategoryType = TypeOf<typeof CategorySchema>