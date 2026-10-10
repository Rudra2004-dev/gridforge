import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  DENSITY_ROW_HEIGHT,
  useSettingsStore,
} from "../../features/settings/settings.store";
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

// ONE template, used by the header AND every row.
// The fixed + minimum widths add up to 964px, which is the .vgrid min-width in App.css.
const GRID_COLUMNS =
  "72px 170px minmax(180px, 1.4fr) minmax(130px, 1fr) minmax(120px, 1fr) 84px 84px 124px";

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

  // Density is changed on the Settings page, so this component is mounted fresh with the
  // new row height when you come back. No virtualizer re-measure needed.
  const density = useSettingsStore((state) => state.density);
  const rowHeight = DENSITY_ROW_HEIGHT[density];

  const rowVirtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
  });

  // New search, filter, sort or page => go back to the top
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [employees]);

  return (
    <div className="vgrid-scroll" ref={scrollRef}>
      <div
        className={`vgrid vgrid--${density}`}
        style={{ ["--cols" as string]: GRID_COLUMNS }}
      >
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
                  height: rowHeight,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="vgrid-cell cell-muted">{employee.id}</div>
                <div className="vgrid-cell">
                  <div className="name-cell" title={employee.name}>
                    <span className="cell-avatar" aria-hidden="true">
                      {getInitials(employee.name)}
                    </span>
                    <strong>{employee.name}</strong>
                  </div>
                </div>
                <div className="vgrid-cell cell-muted" title={employee.email}>
                  {employee.email}
                </div>
                <div className="vgrid-cell" title={employee.role}>
                  {employee.role}
                </div>
                <div className="vgrid-cell" title={employee.department}>
                  {employee.department}
                </div>
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