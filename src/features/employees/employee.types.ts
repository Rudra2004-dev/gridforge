export type EmployeeStatus = 
| "Active"
| "Inactive"
| "On Leave";


export interface Employee  {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    salary: number;
    status: EmployeeStatus;
    joiningDate: string;
}


export type SortKey = keyof Employee;
export type SortDirection = "asc" | "desc";

export interface SortState {
  key: SortKey;
  direction: SortDirection;
}


export interface EmployeeFilters {
  status: EmployeeStatus | null;   // null = "All"
  department: string | null;       // null = "All"
}


export type EmployeeInput = Omit<Employee, "id">;