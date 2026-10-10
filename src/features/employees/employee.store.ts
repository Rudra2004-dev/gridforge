import { create } from "zustand";
import { DEFAULT_FILTERS } from "./employee.filter";
import { generateEmployees } from "./employee.generator";
import { useSettingsStore, type DatasetSize } from "../settings/settings.store";
import type {
  Employee,
  EmployeeFilters,
  EmployeeInput,
  SortKey,
  SortState,
} from "./employee.types";

// Next ID = highest existing number + 1 (not length + 1, which can collide once rows can be removed)
function nextEmployeeId(employees: Employee[]): string {
  let max = 0;
  for (const employee of employees) {
    const value = Number(employee.id.replace(/^EMP/, ""));
    if (value > max) max = value;
  }
  return `EMP${String(max + 1).padStart(4, "0")}`;
}

function generateTimed(size: number) {
  const start = performance.now();
  const employees = generateEmployees(size);
  return { employees, generationMs: performance.now() - start };
}

// The settings store hydrates from localStorage synchronously when it is created,
// so this already reflects the dataset size the user chose last time.
const initial = generateTimed(useSettingsStore.getState().datasetSize);

type EmployeeState = {
  employees: Employee[];
  generationMs: number;
  query: string;
  sort: SortState | null;
  filters: EmployeeFilters;
  setQuery: (query: string) => void;
  toggleSort: (key: SortKey) => void;
  clearSort: () => void;
  setFilter: <K extends keyof EmployeeFilters>(key: K, value: EmployeeFilters[K]) => void;
  resetFilters: () => void;
  showOnly: (filters: Partial<EmployeeFilters>) => void;
  addEmployee: (input: EmployeeInput) => void;
  loadDataset: (size: DatasetSize) => void;
};

export const useEmployeeStore = create<EmployeeState>()((set) => ({
  employees: initial.employees,
  generationMs: initial.generationMs,
  query: "",
  sort: null,
  filters: DEFAULT_FILTERS,

  setQuery: (query) => set({ query }),

  toggleSort: (key) =>
    set((state) => {
      const current = state.sort;
      if (!current || current.key !== key) return { sort: { key, direction: "asc" } };
      if (current.direction === "asc") return { sort: { key, direction: "desc" } };
      return { sort: null };
    }),

  clearSort: () => set({ sort: null }),

  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  // Used by Overview links: jump to the grid with exactly this filter applied.
  showOnly: (filters) =>
    set({ filters: { ...DEFAULT_FILTERS, ...filters }, query: "", sort: null }),

  // One atomic update: add the row AND clear the view, so a leftover search,
  // filter or sort can't hide the employee the user just created.
  addEmployee: (input) =>
    set((state) => ({
      employees: [{ ...input, id: nextEmployeeId(state.employees) }, ...state.employees],
      query: "",
      filters: DEFAULT_FILTERS,
      sort: null,
    })),

  // The single entry point for "replace the data": Settings calls only this.
  // It also records the chosen size so the next page load generates the same amount.
  loadDataset: (size) => {
    const { employees, generationMs } = generateTimed(size);
    useSettingsStore.getState().setDatasetSize(size);
    set({ employees, generationMs, query: "", sort: null, filters: DEFAULT_FILTERS });
  },
}));