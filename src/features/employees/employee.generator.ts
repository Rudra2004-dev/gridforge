import type {Employee} from "./employee.types"

export function generateEmployees(count: number): Employee[]{
    const employees: Employee[] = [];

    for(let i = 1; i <= count; i++) {
        employees.push({
            id: `EMP${String(i).padStart(3, "0")}`,
            name: `Employee ${i}`,
            email: `employees${i}@gridforge.dev`,
            role: "Software Engineer",
            department: "Engineering",
            salary: 80000,
            status: "Active",
            joiningDate: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
          });
    }

    return employees;
}