import React from 'react';
import './Header.css';
import logoImg from '../../assets/CanovaCRM.png';
import { useLocation } from 'react-router-dom';
import ArrowImg from '../../assets/Arrow.png';

const Header = () => {
  const location = useLocation();
  const firstname = localStorage.getItem('firstName');
  const lastname = localStorage.getItem('lastName');

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const renderContent = () => {
    switch (location.pathname) {
      case '/employee/':
        return (
          <div className="greet">
            <p className='greet-msg'>{getGreeting()}</p>
            <p className='user-name'>{`${firstname} ${lastname}`}</p>
          </div>
        );
      case '/employee/leads':
        return (
          <div className="leads-text">
            <img src={ArrowImg} alt="" />
            <p>Leads</p>
          </div>
        )
      case '/employee/sechedule':
        return (
          <div className="sechedule-text">
            <img src={ArrowImg} alt="" />
            <p>Sechedule</p>
          </div>
        )
      case '/employee/profile':
        return (
          <div className="profile-text">
            <img src={ArrowImg} alt="" />
            <p>Profile</p>
          </div>
        )
      default:
        return null;
    }
  };


  return (
    <div className='header'>
      <div className="logo">
        <img src={logoImg} alt="" />
      </div>
      {renderContent()}
    </div>
  )
}

export default Header