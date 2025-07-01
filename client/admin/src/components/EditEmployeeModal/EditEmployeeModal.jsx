import React, { useState, useEffect, useRef } from 'react';
import './EditEmployeeModal.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditEmployeeModal = ({ employee, onClose }) => {
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const modalRef = useRef();
  const [loading, setLoading] = useState(false);
    
      useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };
    
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    

  useEffect(() => {
    if (employee) {
      setFirstname(employee.firstname);
      setLastname(employee.lastname);
      setEmail(employee.email);
    }
  }, [employee]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${backendUrl}/api/employees/${employee._id}`, {
        firstname,
        lastname,
        email,
      });
      toast.success('Employee updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      toast.error('Failed to update employee');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="employee-modal-overlay">
      <div className="employee-modal-content" ref={modalRef}>
        <h2>Edit Employee</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
        <form onSubmit={handleUpdate}>
          <label>First Name</label><br />
          <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} required /><br />

          <label>Last Name</label><br />
          <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required /><br />

          <label>Email</label><br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />

          <button type="submit" className="save-btn" disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>{loading ? 'Updating...' : 'Update'}</button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditEmployeeModal;
