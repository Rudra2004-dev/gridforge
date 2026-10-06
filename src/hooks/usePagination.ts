import { useMemo, useState } from "react";

export const PAGE_SIZE_OPTIONS = [25, 50, 100, 250] as const;
export const DEFAULT_PAGE_SIZE = 50;

/**
 * `resetKey` describes the current "view" (search text, filters, sort, data size).
 * When it changes, we fall back to page 1, without a useEffect that syncs state.
 */
export function usePagination<T>(items: readonly T[], resetKey: string) {
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [requested, setRequested] = useState({ page: 1, key: "" });

  // Page size is part of the key, so changing it also returns to page 1
  const key = `${resetKey}|${pageSize}`;

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Derived, not synced: a request made under an old key is ignored,
  // and the clamp covers the data shrinking underneath us.
  const page = Math.min(requested.key === key ? requested.page : 1, totalPages);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const rangeStart = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, items.length);

  function setPage(next: number) {
    setRequested({ page: Math.min(Math.max(1, next), totalPages), key });
  }

  return { page, pageSize, totalPages, pageItems, rangeStart, rangeEnd, setPage, setPageSize };
}