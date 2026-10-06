export type PageItem = number | "start-ellipsis" | "end-ellipsis";

// Always returns 7 slots when there are more than 7 pages, so the buttons
// don't shift around as you navigate:
//   1 2 3 4 5 … 20   |   1 … 8 9 10 … 20   |   1 … 16 17 18 19 20
export function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, "end-ellipsis", totalPages];
  }

  if (page >= totalPages - 3) {
    return [
      1,
      "start-ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, "start-ellipsis", page - 1, page, page + 1, "end-ellipsis", totalPages];
}