import type { Employee } from "./employee.types";

type CsvColumn = {
  header: string;
  value: (employee: Employee) => string | number;
};

// Same order as the grid. Salary is exported as a raw number ("80000"),
// not "$80,000": formatted currency contains a comma and breaks numeric columns in Excel.
const CSV_COLUMNS: CsvColumn[] = [
  { header: "ID", value: (e) => e.id },
  { header: "Name", value: (e) => e.name },
  { header: "Email", value: (e) => e.email },
  { header: "Role", value: (e) => e.role },
  { header: "Department", value: (e) => e.department },
  { header: "Salary", value: (e) => e.salary },
  { header: "Status", value: (e) => e.status },
  { header: "Joining Date", value: (e) => e.joiningDate },
];

// Spreadsheet apps run text starting with these characters as formulas.
const FORMULA_TRIGGER = /^[=+\-@\t\r]/;

function escapeCell(value: string | number): string {
  let text = String(value);

  // CSV injection guard: a name like =HYPERLINK(...) must stay plain text.
  // Only applies to strings, so a negative number stays a number.
  if (typeof value === "string" && FORMULA_TRIGGER.test(text)) {
    text = `'${text}`;
  }

  // RFC 4180: quote a field containing comma, quote or newline, and double any inner quotes.
  if (/[",\r\n]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function toCsv(employees: Employee[]): string {
  const header = CSV_COLUMNS.map((column) => escapeCell(column.header)).join(",");
  const rows = employees.map((employee) =>
    CSV_COLUMNS.map((column) => escapeCell(column.value(employee))).join(","),
  );

  return [header, ...rows].join("\r\n"); // RFC 4180 line endings
}

// Local date (not UTC), so a file exported at 11pm gets today's date.
// `now` is a parameter so the function is testable.
export function buildCsvFilename(isFiltered: boolean, now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `gridforge-employees${isFiltered ? "-filtered" : ""}-${year}-${month}-${day}.csv`;
}

export function downloadCsv(csv: string, filename: string): void {
  // The BOM (\uFEFF) tells Excel the file is UTF-8, so names like "José" don't turn into "JosÃ©".
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Free the blob. Deferred so the browser has started the download first.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}