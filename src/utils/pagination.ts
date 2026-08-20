import { z } from "zod";

import { PageMeta, PrismaPagination } from "../types/pagination.types";

export const DEFAULT_PAGE_LIMIT = 12;
export const MAX_PAGE_LIMIT = 100;

export const paginationSchema = z.object({
  page: z.coerce
    .number({ error: "Page must be a number" })
    .int("Page must be an integer")
    .min(1, "Page must be greater than 0")
    .default(1),

  limit: z.coerce
    .number({ error: "Limit must be a number" })
    .int("Limit must be an integer")
    .min(1, "Limit must be greater than 0")
    .max(MAX_PAGE_LIMIT, `Limit must be at most ${MAX_PAGE_LIMIT}`)
    .default(DEFAULT_PAGE_LIMIT),
});

export type Pagination = z.infer<typeof paginationSchema>;

export function toPrismaPagination({ page, limit }: Pagination): PrismaPagination {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function buildPageMeta(total: number, { page, limit }: Pagination): PageMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
