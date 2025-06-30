import React, { useContext, useState } from 'react'
import './EmployeePage.css'
import EmployeeTable from '../../components/EmployeeTable/EmployeeTable'
import AddEmployeeModal from '../../components/AddEmployeeModal/AddEmployeeModal';
import axios from 'axios';
import { useEffect } from 'react';
import { SearchContext } from '../../context/SearchContext';

const EmployeePage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [modalOpen, setModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const { searchQuery } = useContext(SearchContext);
  const [loading, setLoading] = useState(true);
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/employees/`);
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);


  const filteredEmployees = employees.filter((emp) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();

    const name = `${emp.firstname} ${emp.lastname}`.toLowerCase();
    const id = emp._id?.slice(-10).toLowerCase(); // matches displayed ID
    const status = emp.status?.toLowerCase();
    const assigned = String(emp.assignedLeads || 0);
    const closed = String(emp.closedLeads || 0);

    return (
      name.includes(query) ||
      id.includes(query) ||
      status.includes(query) ||
      assigned.includes(query) ||
      closed.includes(query)
    );
  });

  return (
    <div className='employee-page'>
      {loading ? (
        <div className="employee-loading">
          <div className="spinner"></div>
          <p>Data is fetching from backend...</p>
        </div>
      ) : (
        <>
        <div className="heading-add-btn">
            <div className="heading">
                <p>Home &gt; Employees</p>
            </div>
            <div className="add-btn">
                <button onClick={() => setModalOpen(true)}>Add Employee</button>
            </div>
        </div>
        <div className="employee">
            <EmployeeTable employees={filteredEmployees} refreshEmployees={fetchEmployees} />
        </div>
         <AddEmployeeModal isOpen={modalOpen} onClose={() => {setModalOpen(false);  fetchEmployees()} } />
          </>
      )}
    </div>
  )
}

export default EmployeePage