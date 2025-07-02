import React, { useState } from 'react';
import './Login.css';
import logoImg from '../../assets/CanovaCRM.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/employees/login`, // Update with your backend URL
        { email, password },
        { withCredentials: true } // Important: allows sending session cookies
      );

      // Save employeeId to localStorage or context if needed
      localStorage.setItem('employeeId', res.data.employeeId);
      localStorage.setItem('firstName', res.data.firstName);
      localStorage.setItem('lastName', res.data.lastName)

      setError('');
      navigate('/employee/'); // Redirect after login
    } catch (err) {
       setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false); // 🔹 re-enable after response
    }
  };

  return (
    <div className='login-page'>
      {/* <div className="login-logo">
        <img src={logoImg} alt="logo" />
      </div> */}
      <div className="email-password">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>{loading ? 'Logging in...' : 'Login'}</button>
        {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;

