// import React, { useState } from 'react';
// import './Login.css';
// import logoImg from '../../assets/CanovaCRM.png';

// const Login = () => {
//   return (
//     <div className='login-page'>
//       <div className="login-logo">
//         <img src={logoImg} alt="logo" />
//       </div>
//       <div className="email-password">
//         <input
//           type="text"
//           placeholder="Email"
//         />
//         <input
//           type="password"
//           placeholder='Password'
//         />
//         <button>Login</button>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import './Login.css';
import logoImg from '../../assets/CanovaCRM.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8080/api/employees/login', // Update with your backend URL
        { email, password },
        { withCredentials: true } // Important: allows sending session cookies
      );

      // Save employeeId to localStorage or context if needed
      localStorage.setItem('employeeId', res.data.employeeId);
      localStorage.setItem('firstName', res.data.firstName);
      localStorage.setItem('lastName', res.data.lastName)

      
      navigate('/'); // Redirect after login
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='login-page'>
      <div className="login-logo">
        <img src={logoImg} alt="logo" />
      </div>
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
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;

