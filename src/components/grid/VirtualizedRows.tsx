import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Employee, EmployeeStatus } from "../../features/employees/employee.types";

type VirtualizedRowsProps = {
  employees: Employee[];
};

const ROW_HEIGHT = 56;

// ONE template, used by the header AND every row
const GRID_COLUMNS =
  "96px 220px minmax(240px, 1.5fr) minmax(160px, 1fr) minmax(140px, 1fr) 120px 110px 130px";

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

function VirtualizedRows({ employees }: VirtualizedRowsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  return (
    <div className="vgrid-scroll" ref={scrollRef}>
      <div className="vgrid" style={{ ["--cols" as string]: GRID_COLUMNS }}>
        <div className="vgrid-row vgrid-header" role="row">
          <div className="vgrid-cell">ID</div>
          <div className="vgrid-cell">Name</div>
          <div className="vgrid-cell">Email</div>
          <div className="vgrid-cell">Role</div>
          <div className="vgrid-cell">Department</div>
          <div className="vgrid-cell vgrid-cell--right">Salary</div>
          <div className="vgrid-cell">Status</div>
          <div className="vgrid-cell vgrid-cell--right">Joining Date</div>
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