import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const maskEmail = (email: string) => {
  const [username, domain] = email.split("@");
  let maskedUsername = "";

  if (username!.length < 4) {
    maskedUsername = "*".repeat(username!.length) + "@" + domain;
  }

  maskedUsername = username?.slice(0, -3) + "***" + "@" + domain;

  return maskedUsername;
};

export const getPageRange = (totalPages: number, currentPage:number) => {
  const visiblePageCount = 7;
  const visiblePageCountHalf = Math.floor(visiblePageCount / 2);

  let startPage = Math.max(1, currentPage - visiblePageCountHalf);
  let endPage = Math.min(totalPages, startPage + visiblePageCount - 1);

  if (currentPage < visiblePageCountHalf + 1) {
    endPage = Math.min(visiblePageCount, totalPages);
  } else if (currentPage > totalPages - visiblePageCountHalf) {
    startPage = Math.max(1, totalPages - visiblePageCount + 1);
  }

  const result = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );
  return result
};

export const PLACEHOLDER_PAGES = [1,2,3,4,5,6,7]