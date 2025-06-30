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
                    <Link to={'/'} className={location.pathname === '/' ? 'active' : ''}><p>Dashboard</p></Link>
                    <Link to={'/leads'} className={location.pathname === '/leads' ? 'active' : ''}><p>Leads</p></Link>
                    <Link to={'/employees'} className={location.pathname === '/employees' ? 'active' : ''}><p>Employees</p></Link>
                    <Link to={'/settings'} className={location.pathname === '/settings' ? 'active' : ''}><p>Settings</p></Link>
                </div>
            </div>
        </div>
    )
}

export default Sidebar