import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import logo from '../../assets/logo.png';
import './DashboardHeader.css';

const DashboardHeader = () => {
  const { userId } = useParams();

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/account/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem('authToken');
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt('Please enter your password to delete the account:');
    if (!password) return;

    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/account/delete`,
        {
          data: { password },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem('authToken');
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className="header-container">
      <div className="logo-container">
        <img src={logo} className="logo" alt="Platform Logo" />
        <h1>IntelliMonitor</h1>
      </div>
      <div className="header-options">
        <div className="notification-dropdown">
          <FaBell className="icon" />
          <div className="dropdown-content">
            <p>No new notifications</p>
          </div>
        </div>
        <div className="report-button">
          <Link to={`/report/${userId}`}>
            <button>Generate Report</button>
          </Link>
        </div>
        <div className="profile-dropdown">
          <FaUserCircle className="icon" />
          <div className="dropdown-content">
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
