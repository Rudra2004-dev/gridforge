import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type {
  Employee,
  EmployeeStatus,
  SortKey,
  SortState,
} from "../../features/employees/employee.types";

type VirtualizedRowsProps = {
  employees: Employee[];
  sort: SortState | null;
  onSort: (key: SortKey) => void;
};

const ROW_HEIGHT = 56;

// ONE template, used by the header AND every row
const GRID_COLUMNS =
  "96px 220px minmax(240px, 1.5fr) minmax(160px, 1fr) minmax(140px, 1fr) 120px 110px 130px";

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
  { key: "salary", label: "Salary", align: "right" },
  { key: "status", label: "Status" },
  { key: "joiningDate", label: "Joining Date", align: "right" },
];

const salaryFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function statusClassName(status: EmployeeStatus): string {
  if (status === "Active") return "status-badge status-badge--active";
  if (status === "On Leave") return "status-badge status-badge--leave";
  return "status-badge status-badge--inactive";
}

function VirtualizedRows({ employees, sort, onSort }: VirtualizedRowsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  // New search or sort result => go back to the top
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [employees]);

  return (
    <div className="vgrid-scroll" ref={scrollRef}>
      <div className="vgrid" style={{ ["--cols" as string]: GRID_COLUMNS }}>
        <div className="vgrid-row vgrid-header" role="row">
          {COLUMNS.map(({ key, label, align }) => {
            const direction = sort?.key === key ? sort.direction : null;
            const ariaSort =
              direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none";

            return (
              <div
                key={key}
                role="columnheader"
                aria-sort={ariaSort}
                className={`vgrid-cell vgrid-cell--head${align === "right" ? " vgrid-cell--right" : ""}`}
              >
                <button
                  type="button"
                  className={`sort-button${direction ? " is-active" : ""}`}
                  onClick={() => onSort(key)}
                >
                  <span>{label}</span>
                  {direction === "asc" ? (
                    <ArrowUp size={12} />
                  ) : direction === "desc" ? (
                    <ArrowDown size={12} />
                  ) : (
                    <ArrowUpDown size={12} className="sort-icon-idle" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const employee = employees[virtualRow.index];
            return (
              <div
                key={employee.id}
                className="vgrid-row vgrid-body-row"
                role="row"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: ROW_HEIGHT,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="vgrid-cell cell-muted">{employee.id}</div>
                <div className="vgrid-cell">
                  <div className="name-cell">
                    <span className="cell-avatar" aria-hidden="true">
                      {getInitials(employee.name)}
                    </span>
                    <strong>{employee.name}</strong>
                  </div>
                </div>
                <div className="vgrid-cell cell-muted">{employee.email}</div>
                <div className="vgrid-cell">{employee.role}</div>
                <div className="vgrid-cell">{employee.department}</div>
                <div className="vgrid-cell vgrid-cell--right">
                  {salaryFormatter.format(employee.salary)}
                </div>
                <div className="vgrid-cell">
                  <span className={statusClassName(employee.status)}>{employee.status}</span>
                </div>
                <div className="vgrid-cell vgrid-cell--right cell-muted">
                  {employee.joiningDate}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VirtualizedRows;