import { STATUS_OPTIONS } from "./employee.filter";
import type { EmployeeInput } from "./employee.types";

// Every form value is a string, because that's what inputs give you.
// Parsing to real types happens once, after validation passes.
export type EmployeeFormValues = {
  name: string;
  email: string;
  department: string;
  role: string;
  salary: string;
  status: string;
  joiningDate: string;
};

export type EmployeeFormErrors = Partial<Record<keyof EmployeeFormValues, string>>;

export const MAX_SALARY = 10_000_000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Local date (not UTC), same reasoning as the CSV filename.
export function todayIso(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Round-trips the date so "2026-02-31" is rejected instead of silently becoming March 3.
function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const collapseSpaces = (text: string) => text.trim().replace(/\s+/g, " ");

export function validateEmployeeForm(
  values: EmployeeFormValues,
  existingEmails: ReadonlySet<string>, // lowercase
): { errors: EmployeeFormErrors; data: EmployeeInput | null } {
  const errors: EmployeeFormErrors = {};

  const name = collapseSpaces(values.name);
  const email = values.email.trim().toLowerCase();
  const department = values.department.trim();
  const role = collapseSpaces(values.role);
  const salaryText = values.salary.trim();
  const status = STATUS_OPTIONS.find((option) => option === values.status);

  // Checks run in the same order as the fields appear, so the first error is the top-most field.
  if (!name) errors.name = "Name is required.";
  else if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  else if (name.length > 60) errors.name = "Name must be 60 characters or fewer.";

  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
  else if (existingEmails.has(email)) errors.email = "An employee with this email already exists.";

  if (!department) errors.department = "Choose a department.";

  if (!role) errors.role = "Role is required.";
  else if (role.length > 60) errors.role = "Role must be 60 characters or fewer.";

  if (!salaryText) errors.salary = "Salary is required.";
  else if (!/^\d+$/.test(salaryText)) errors.salary = "Enter a whole number, for example 80000.";
  else if (Number(salaryText) <= 0) errors.salary = "Salary must be greater than 0.";
  else if (Number(salaryText) > MAX_SALARY)
    errors.salary = `Salary can't exceed ${MAX_SALARY.toLocaleString("en-US")}.`;

  if (!status) errors.status = "Choose a status.";

  if (!values.joiningDate) errors.joiningDate = "Joining date is required.";
  else if (!isValidIsoDate(values.joiningDate)) errors.joiningDate = "Enter a valid date.";

  if (Object.keys(errors).length > 0 || !status) return { errors, data: null };

  return {
    errors,
    data: {
      name,
      email,
      department,
      role,
      salary: Number(salaryText),
      status,
      joiningDate: values.joiningDate,
    },
  };
}