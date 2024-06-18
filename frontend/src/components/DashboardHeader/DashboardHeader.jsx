import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import logo from '../../assets/logo.png';
import './DashboardHeader.css';

const DashboardHeader = () => {
  const { userId } = useParams();

  const handleEditAccount = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/account/generate-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.href = `/otp-account?userId=${userId}`;
    } catch (error) {
      console.error('Error generating OTP:', error);
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
            <button onClick={handleEditAccount}>Edit Account</button>
            <Link to="/logout">Logout</Link>
            <Link to="/delete-account">Delete Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
