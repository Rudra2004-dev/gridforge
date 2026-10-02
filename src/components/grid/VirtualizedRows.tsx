import {useRef} from "react";
import type { Employee } from "../../features/employees/employee.types";
import { useVirtualizer } from "@tanstack/react-virtual";

type VirtualizedRowsProps = {
    employees: Employee[];
};


function VirtualizedRows({ employees }: VirtualizedRowsProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: employees.length,

        getScrollElement: () => parentRef.current,

        estimateSize: () => 48,

        overscan: 5,
    });

    const virtualRows = rowVirtualizer.getVirtualItems();

    return(
        <div
        ref={parentRef}
        style={{
            height: "500px",
            overflow: "auto",
        }}
        >
            <div
            style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
            }}
            >
                {virtualRows.map((virtualRow) => {
                    const employee = employees[virtualRow.index];

                    return(
                        <div
                        key={employee.id}
                        data-virtual-row
                        style={{
                            position: "absolute",
                            top: 0,
                            transform: `translateY(${virtualRow.start}px)`,
                            width: "100%",
                            height: `${virtualRow.size}px`
                        }}
                        >
                            {employee.name}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default VirtualizedRows;