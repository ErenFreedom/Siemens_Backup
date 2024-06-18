import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import logo from '../../assets/logo.png'; // Ensure the path to the logo is correct
import './DashboardHeader.css';

const DashboardHeader = () => {
  const { userId } = useParams();

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
            <Link to={`/otp-account`}>Edit Account</Link> {/* Navigate to otp-account */}
            <Link to="/logout">Logout</Link>
            <Link to="/delete-account">Delete Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
