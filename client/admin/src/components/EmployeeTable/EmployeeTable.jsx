import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeTable.css';
import TableRowMenu from '../TableRowMenu/TableRowMenu';
import EditEmployeeModal from '../EditEmployeeModal/EditEmployeeModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeTable = ({ employees, refreshEmployees }) => {
  // const [employees, setEmployees] = useState([]);
  const [sortByNameAsc, setSortByNameAsc] = useState(true);
const [sortedEmployees, setSortedEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
  setSortedEmployees(employees); // default to unmodified order
}, [employees]);

const handleSortByName = () => {
  const sorted = [...sortedEmployees].sort((a, b) => {
    const nameA = `${a.firstname} ${a.lastname}`.toLowerCase();
    const nameB = `${b.firstname} ${b.lastname}`.toLowerCase();
    return sortByNameAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });
  setSortedEmployees(sorted);
  setSortByNameAsc(!sortByNameAsc);
};

  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
  setShowEditModal(true);
  };

  const closeEditModal = () => {
  setShowEditModal(false);
  setSelectedEmployee(null);
};

  const handleDelete = async (emp) => {
    // confirm and delete employee
    const confirmDelete = window.confirm(
    `Are you sure you want to delete ${emp.firstname} ${emp.lastname}?\nTheir open leads will be reassigned.`
  );

  if (!confirmDelete) return;

  try {
    const res = await axios.delete(`http://localhost:8080/api/employees/${emp._id}`);
    toast.success(res.data.message || 'Employee deleted successfully!');
    fetchEmployees(); // Refresh the table
  } catch (err) {
    console.error('Delete error:', err);
    toast.error(err.response?.data?.error || 'Failed to delete employee.');
  }
    console.log('Delete:', emp);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedEmployees.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(employees.length / rowsPerPage);

  return (
    <>
    <div className="table-container">
      <table className="employee-table">
        <thead>
            <tr>
            <th onClick={handleSortByName} style={{ cursor: 'pointer' }}>
              Name {sortByNameAsc ? (
                <i className="fa-solid fa-up-long"></i>
              ) : (
                <i className="fa-solid fa-down-long"></i>
              )}
              </th>
            <th>Employee ID</th>
            <th>Assigned Leads</th>
            <th>Closed Leads</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((emp, idx) => (
            <tr key={emp._id}>
              <td className="employee-info">
                <div className="avatar initials">
                  {emp.firstname?.charAt(0)}{emp.lastname?.charAt(0)}
                </div>
                <div className="employee-details">
                  <p className="emp-name">{emp.firstname} {emp.lastname}</p>
                  <p className="emp-email">{emp.email}</p>
                </div>
              </td>
              <td>{emp._id}</td>
              <td>{emp.assignedLeads || 0}</td>
              <td>{emp.closedLeads || 0}</td>
              <td>
                <span className={`status ${emp.status.toLowerCase()}`}>{emp.status}</span>
              </td>
              <td>
                <TableRowMenu
                  onEdit={() => handleEdit(emp)}
                  onDelete={() => handleDelete(emp)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          ← Previous
        </button>
        <div>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
          Next →
        </button>
      </div>
    </div>
    {showEditModal && (
      <EditEmployeeModal
        employee={selectedEmployee}
        onClose={closeEditModal}
      />
    )}
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default EmployeeTable;

