import DataGrid from "./components/grid/DataGrid";
import PageContainer from "./components/layout/PageContainer";
import EmployeePageHeader from "./features/employees/EmployeePageHeader";
import EmployeeStats from "./features/employees/EmployeeStats";
import "./App.css";

const App = () => {
  return (
    <PageContainer>
      <EmployeePageHeader />
      <EmployeeStats />
      <DataGrid />
    </PageContainer>
  );
};

export default App;
