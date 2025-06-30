import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';

const Profile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [employee, setEmployee] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const employeeId = localStorage.getItem('employeeId');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/employees/${employeeId}`);
        const data = res.data;

        setEmployee({
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          email: data.email || '',
          password: data.password || '',
          confirmPassword: data.password || ''
        });
      } catch (err) {
        console.error('Error fetching employee:', err);
      }
    };

    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (employee.password !== employee.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.put(`${backendUrl}/api/employees/${employeeId}`, {
        firstname: employee.firstname,
        lastname: employee.lastname,
        email: employee.email,
        password: employee.password
      });

      alert('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Update failed');
    }
  };

  return (
    <div className='profile'>
      <div className="form">
        <label>First Name</label>
        <input type="text" name="firstname" value={employee.firstname} onChange={handleChange} />

        <label>Last Name</label>
        <input type="text" name="lastname" value={employee.lastname} onChange={handleChange} />

        <label>Email</label>
        <input type="text" name="email" value={employee.email} onChange={handleChange} />

        <label>Password</label>
        <div className="password-wrapper">
          <input type={showPassword ? 'text' : 'password'} name="password" value={employee.password} onChange={handleChange} />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <i className="fa-solid fa-eye-slash"></i> :  <i className="fa-solid fa-eye"></i> }
          </button>
        </div>


        <label>Confirm Password</label>
        <div className="password-wrapper">
          <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={employee.confirmPassword} onChange={handleChange} />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowConfirm(prev => !prev)}
          >
            {showConfirm ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
          </button>
        </div>

      </div>

      <div className="save-btn">
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default Profile;
