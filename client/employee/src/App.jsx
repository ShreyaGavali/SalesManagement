import React from 'react'
import Header from './components/Header/Header'
import './App.css';
import {Routes , Route, useLocation, useNavigate} from 'react-router-dom'
import Home from './pages/Home/Home';
import Leads from './pages/Leads/Leads';
import Schedule from './pages/Schedule/Schedule';
import Profile from './pages/Profile/Profile';
import BottomNavBar from './components/BottomNavBar/BottomNavBar';
import Login from './pages/Login/Login';
import { useEffect } from 'react';

const App = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
   const navigate = useNavigate();
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
  const navEntries = performance.getEntriesByType("navigation");
  const isRefresh = navEntries.length > 0 && navEntries[0].type === "reload";

  sessionStorage.setItem("isRefresh", isRefresh ? "true" : "false");

  // Clear refresh flag 1 second after load (just to be safe)
  setTimeout(() => {
    sessionStorage.removeItem("isRefresh");
  }, 1000);
}, []);


useEffect(() => {
  const handleBeforeUnload = () => {
    const isRefresh = sessionStorage.getItem("isRefresh") === "true";
    const employeeId = localStorage.getItem("employeeId");

    if (!isRefresh && employeeId) {
      // ✅ Remove employeeId FIRST
      localStorage.removeItem("employeeId");

      // ✅ Then send it via beacon
      const data = JSON.stringify({ employeeId });
      const blob = new Blob([data], { type: "application/json" });
      navigator.sendBeacon(`${backendUrl}/api/employees/break-start`, blob);
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);


  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId");
    if (!employeeId && !isLoginPage) {
      navigate('/employee/login');
    }
  }, [location.pathname]);

  return (
    <div className='main'>
      <div className="app">
          {!isLoginPage && <Header />}
          <Routes>
            <Route path='/employee/' element={<Home />} />
            <Route path='/employee/leads' element={<Leads />} />
            <Route path='/employee/sechedule' element={<Schedule />} />
            <Route path='/employee/profile' element={<Profile />} />
            <Route path='/employee/login' element={<Login />} />
          </Routes>
          {!isLoginPage && <BottomNavBar />}
      </div>
    </div>
  )
}

export default App