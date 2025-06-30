import React from 'react';
import './BottomNavBar.css';
import HomeImg from '../../assets/Home.png';
import LeadImg from '../../assets/Leads.png';
import CalenderImg from '../../assets/Calendar.png';
import ProfileImg from '../../assets/Profile.png';
import { Link, useLocation } from 'react-router-dom';

 
const BottomNavBar = () => {
  const location = useLocation();
  return (
    <div className='bottom-nav-bar'>
      <Link to={'/employee/'}>
      <div className={`home-tab ${location.pathname === '/employee/' ? 'active' : ''}`}>
        <img className='home-img' src={HomeImg} alt="" />
        <p>Home</p>
      </div>
      </Link>
      <Link to={'/employee/leads'}>
      <div className={`lead-tab ${location.pathname === '/employee/leads' ? 'active' : ''}`}>
        <img src={LeadImg} alt="" />
        <p>Leads</p>
      </div>
      </Link>
      <Link to={'/employee/sechedule'}>
      <div className={`sechudle-tab ${location.pathname === '/employee/sechedule' ? 'active' : ''}`}>
        <img src={CalenderImg} alt="" />
        <p>Sechudle</p>
      </div>
      </Link>
      <Link to={'/employee/profile'}>
      <div className={`profile-tab ${location.pathname === '/employee/profile' ? 'active' : ''}`}>
        <img src={ProfileImg} alt="" />
        <p>Profile</p>
      </div>
      </Link>
    </div>
  )
}

export default BottomNavBar