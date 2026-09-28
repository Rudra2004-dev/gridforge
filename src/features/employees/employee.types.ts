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