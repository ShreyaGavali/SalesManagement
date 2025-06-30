import React from "react";
import "./EmployeeTable.css";

// const EmployeeTable = () => {
//   return (
//     <div className="table-container">
//       <table className="employee-table">
//         <thead>
//           <tr>
//             <th><input type="checkbox" /></th>
//             <th>Name</th>
//             <th>Employee ID</th>
//             <th>Assigned Leads</th>
//             <th>Closed Leads</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {employees.map((emp, index) => (
//             <tr key={index}>
//               <td><input type="checkbox" /></td>
//               <td className="employee-info">
//                 {emp.image ? (
//                   <img src={emp.image} alt={emp.name} className="avatar" />
//                 ) : (
//                   <div className="avatar initials">
//                     {emp.name
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")
//                       .toUpperCase()}
//                   </div>
//                 )}
//                 <div className="employee-details">
//                   <p className="emp-name">{emp.name}</p>
//                   <p className="emp-email">@{emp.email}</p>
//                 </div>
//               </td>
//               <td>{emp.employeeId}</td>
//               <td>{emp.assigned}</td>
//               <td>{emp.closed}</td>
//               <td>
//                 <span className="status active">● {emp.status}</span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

const EmployeeTable = ({ employees }) => {
  return (
    <div className="table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Assigned Leads</th>
            <th>Closed Leads</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td className="employee-info">
                {emp.image ? (
                  <img src={emp.image} alt={emp.firstname} className="avatar" />
                ) : (
                  <div className="avatar initials">
                    {`${emp.firstname[0]}${emp.lastname[0]}`.toUpperCase()}
                  </div>
                )}
                <div className="employee-details">
                  <p className="emp-name">{`${emp.firstname} ${emp.lastname}`}</p>
                  <p className="emp-email">@{emp.email}</p>
                </div>
              </td>
              <td>{emp._id}</td>
              <td>{emp.assignedLeads}</td>
              <td>{emp.closedLeads}</td>
              <td>
                <span className={`status ${emp.status.toLowerCase()}`}>● {emp.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default EmployeeTable;
