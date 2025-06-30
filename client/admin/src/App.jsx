import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import {Route, Routes} from "react-router-dom";
import Dashboard from './pages/DashboardPage/Dashboard';
import LeadPage from './pages/LeadPage/LeadPage';
import EmployeePage from './pages/EmployeePage/EmployeePage';
import Settings from './pages/SettingsPage/Settings';

const App = () => {
  return (
    <div className="main">
      <Sidebar />
      <div className="pages">
        <Navbar />
        <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/leads' element={<LeadPage />} />
            <Route path='/employees' element={<EmployeePage />} />
            <Route path='/settings' element={<Settings />} />
        </Routes>
      </div>
    </div>
  )
}

export default App