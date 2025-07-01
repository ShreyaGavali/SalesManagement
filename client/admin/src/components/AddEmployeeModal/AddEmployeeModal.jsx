import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './AddEmployeeModal.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEmployeeModal = ({ isOpen, onClose }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
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
  

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!firstname.trim()) newErrors.firstname = 'First name is required';
    if (!lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!language.trim()) newErrors.language = 'Language is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const employeeData = {
      firstname,
      lastname,
      email,
      location,
      language
    };

    try {
      await axios.post(`${backendUrl}/api/employees`, employeeData);
       toast.success('Employee added successfully!');
       setFirstname('');
    setLastname('');
    setEmail('');
    setLocation('');
    setLanguage('');
    setErrors({});
    setLoading(false);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
       toast.error('Error adding employee: ' + (err.response?.data?.error || 'Server error'));
       setLoading(false);
    }
  };

  const renderError = (field) =>
    errors[field] && (
      <div className="error-msg">
        <i class="fa-solid fa-circle-exclamation" style={{color: 'red'}}></i> {errors[field]}
      </div>
    );

  return (
    <div className="employee-modal-overlay">
      <div className="employee-modal-content" ref={modalRef}>
        <h2>Add New Employee</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
        <form onSubmit={handleSubmit} noValidate>
          <label>First Name</label><br />
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="First name"
          />
          {renderError('firstname')}<br />

          <label>Last Name</label><br />
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Last name"
          />
          {renderError('lastname')}<br />

          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          {renderError('email')}<br />

          <label>Location</label><br />
          <div className="select-with-tooltip">
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">Select Location</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Delhi">Delhi</option>
            </select>
            <span className="tooltip">Lead will be assigned on basis of location</span>
          </div>
          {renderError('location')}<br />

          <div>Preferred Language</div><br />
          <div className="select-with-tooltip">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="">Select Language</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Bengali">Bengali</option>
              <option value="Tamil">Tamil</option>
            </select>
            <span className="tooltip">Lead will be assigned on basis of language</span>
          </div>
          {renderError('language')}<br />

          <button type="submit" className="save-btn" disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}> {loading ? 'Saving...' : 'Save'}</button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddEmployeeModal;


