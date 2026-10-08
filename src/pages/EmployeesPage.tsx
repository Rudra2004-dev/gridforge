import DataGrid from "../components/grid/DataGrid";
import EmployeePageHeader from "../features/employees/EmployeePageHeader";

function EmployeesPage() {
  return (
    <>
      <title>Employees · GridForge</title>
      <EmployeePageHeader />
      <DataGrid />
    </>
  );
}

export default EmployeesPage;