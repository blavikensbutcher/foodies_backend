export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PrismaPagination {
  skip: number;
  take: number;
}
