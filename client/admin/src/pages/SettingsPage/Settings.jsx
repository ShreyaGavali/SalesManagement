import React, { useState, useEffect } from 'react';
import './Setting.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [admin, setAdmin] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const adminId = '68623b48198a8d0457c67eff';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/admin/${adminId}`);
        setAdmin({
          ...res.data,
          confirmPassword: res.data.password,
        });
      } catch (err) {
        console.error('Failed to fetch admin:', err);
      }finally {
      setLoading(false);
    }
    };
    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error as user types
  };

  const validate = () => {
    const newErrors = {};
    if (!admin.firstname) newErrors.firstname = 'First name is required';
    if (!admin.lastname) newErrors.lastname = 'Last name is required';
    if (!admin.email) newErrors.email = 'Email is required';
    if (!admin.password) newErrors.password = 'Password is required';
    if (!admin.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    if (admin.password && admin.confirmPassword && admin.password !== admin.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);

    try {
      await axios.put(`${backendUrl}/api/admin/${adminId}`, {
        firstname: admin.firstname,
        lastname: admin.lastname,
        email: admin.email,
        password: admin.password,
      });
       toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="seetings">
      {loading ? (
      <div className="settings-loading">
        <div className="spinner"></div>
        <p>Data is fetching from backend...</p>
      </div>
    ) : (
      <>
      <div className="heading">
        <p>Home &gt; Settings</p>
      </div>
      <div className="admin-form">
        <p>Edit Profile</p>
        <hr />
        <div className="form">
          <label>First name</label>
          <input type="text" name="firstname" value={admin.firstname} onChange={handleChange} placeholder="first name" />
          {errors.firstname && <p className="error-msg"><i class="fa-solid fa-circle-exclamation"></i> {errors.firstname}</p>}

          <label>Last name</label>
          <input type="text" name="lastname" value={admin.lastname} onChange={handleChange} placeholder="last name" />
          {errors.lastname && <p className="error-msg"><i class="fa-solid fa-circle-exclamation"></i> {errors.lastname}</p>}

          <label>Email</label>
          <input type="text" name="email" value={admin.email} onChange={handleChange} placeholder="email" />
          {errors.email && <p className="error-msg"><i class="fa-solid fa-circle-exclamation"></i> {errors.email}</p>}

          <label>Password</label>
          <input type="password" name="password" value={admin.password} onChange={handleChange} placeholder="password" />
          {errors.password && <p className="error-msg"><i class="fa-solid fa-circle-exclamation"></i> {errors.password}</p>}

          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={admin.confirmPassword} onChange={handleChange} placeholder="confirm password" />
          {errors.confirmPassword && <p className="error-msg"><i class="fa-solid fa-circle-exclamation"></i> {errors.confirmPassword}</p>}

          <div className="save-btn" onClick={handleSave} disabled={saving} style={{ cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
             {saving ? 'Saving...' : 'Save'}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      </>
    )}
    </div>
  );
};

export default Settings;

