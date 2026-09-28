import {employees,} from "../../features/employees/employee.data"

function DataGrid() {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Joinng Date</th>
                </tr>
            </thead>


            <tbody>
                {employees.map((employee) => (
                    <tr key={employee.id}>
                        <td>{employee.id}</td>
                        <td>{employee.name}</td>
                        <td>{employee.role}</td>
                        <td>{employee.department}</td>
                        <td>{employee.salary}</td>
                        <td>{employee.status}</td>
                        <td>{employee.joiningDate}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}


export default DataGrid;