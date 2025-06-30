import React from 'react';
import './Sidebar.css';
import logoImg from '../../assets/CanovaCRM.png'
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    return (
        <div className="side-bar">
            <div className="logo">
                <img src={logoImg} alt="" />
            </div>
            <div className="list-profile-logout">
                <div className="list-items">
                    <Link to={'/admin/'} className={location.pathname === '/admin/' ? 'active' : ''}><p>Dashboard</p></Link>
                    <Link to={'/admin/leads'} className={location.pathname === '/admin/leads' ? 'active' : ''}><p>Leads</p></Link>
                    <Link to={'/admin/employees'} className={location.pathname === '/admin/employees' ? 'active' : ''}><p>Employees</p></Link>
                    <Link to={'/admin/settings'} className={location.pathname === '/admin/settings' ? 'active' : ''}><p>Settings</p></Link>
                </div>
            </div>
        </div>
    )
}

export default Sidebar