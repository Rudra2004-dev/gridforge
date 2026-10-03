import type { Employee, EmployeeStatus } from "./employee.types";

// Small, fast, deterministic PRNG (mulberry32). Same seed => same sequence.
function createRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rng = () => number;

const FIRST_NAMES = [
  "Aarav", "Priya", "Liam", "Sofia", "Rohan", "Emma", "Arjun", "Mia", "Noah", "Ananya",
  "Ethan", "Isha", "Lucas", "Neha", "Oliver", "Kavya", "Mateo", "Sara", "Vikram", "Zoe",
  "Daniel", "Meera", "Henry", "Riya", "Samuel", "Tara", "Leo", "Diya", "Jack", "Nora",
] as const;

const LAST_NAMES = [
  "Sharma", "Patel", "Smith", "Garcia", "Das", "Johnson", "Singh", "Brown", "Ghosh", "Lee",
  "Mukherjee", "Martin", "Gupta", "Wilson", "Banerjee", "Clark", "Reddy", "Lopez", "Nair", "Kim",
  "Chatterjee", "Walker", "Mehta", "Young", "Iyer", "Hall", "Roy", "Allen", "Khan", "Scott",
] as const;

const DEPARTMENTS = {
  Engineering: {
    roles: ["Software Engineer", "Senior Software Engineer", "Frontend Engineer", "Backend Engineer", "DevOps Engineer", "QA Engineer"],
    salary: [70000, 160000],
  },
  Design: {
    roles: ["Product Designer", "UI Designer", "UX Researcher", "Design Lead"],
    salary: [55000, 120000],
  },
  "Machine Learning": {
    roles: ["ML Engineer", "Data Scientist", "Research Scientist", "MLOps Engineer"],
    salary: [85000, 180000],
  },
  Product: {
    roles: ["Product Manager", "Product Analyst", "Program Manager"],
    salary: [70000, 150000],
  },
  Sales: {
    roles: ["Account Executive", "Sales Development Rep", "Sales Manager"],
    salary: [45000, 110000],
  },
  HR: {
    roles: ["Recruiter", "HR Business Partner", "People Operations Manager"],
    salary: [40000, 95000],
  },
} as const;

type DepartmentName = keyof typeof DEPARTMENTS;
const DEPARTMENT_NAMES = Object.keys(DEPARTMENTS) as DepartmentName[];

const JOIN_START = Date.UTC(2018, 0, 1);
const JOIN_END = Date.UTC(2026, 8, 30);

function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

// ~85% Active, ~8% On Leave, ~7% Inactive
function pickStatus(rng: Rng): EmployeeStatus {
  const roll = rng();
  if (roll < 0.85) return "Active";
  if (roll < 0.93) return "On Leave";
  return "Inactive";
}

function pickJoiningDate(rng: Rng): string {
  const time = JOIN_START + Math.floor(rng() * (JOIN_END - JOIN_START));
  return new Date(time).toISOString().slice(0, 10); // YYYY-MM-DD
}

export function generateEmployees(count: number, seed = 42): Employee[] {
  const rng = createRng(seed);
  const usedEmails = new Set<string>();
  const employees: Employee[] = [];

  for (let i = 1; i <= count; i++) {
    const first = pick(rng, FIRST_NAMES);
    const last = pick(rng, LAST_NAMES);
    const department = pick(rng, DEPARTMENT_NAMES);
    const { roles, salary } = DEPARTMENTS[department];
    const [minSalary, maxSalary] = salary;

    // 30 x 30 names collide quickly, so make emails unique
    const baseEmail = `${first}.${last}`.toLowerCase();
    let email = `${baseEmail}@gridforge.dev`;
    let suffix = 2;
    while (usedEmails.has(email)) {
      email = `${baseEmail}${suffix}@gridforge.dev`;
      suffix++;
    }
    usedEmails.add(email);

    employees.push({
      id: `EMP${String(i).padStart(4, "0")}`,
      name: `${first} ${last}`,
      email,
      role: pick(rng, roles),
      department,
      salary: Math.round((minSalary + rng() * (maxSalary - minSalary)) / 500) * 500,
      status: pickStatus(rng),
      joiningDate: pickJoiningDate(rng),
    });
  }

  return employees;
}