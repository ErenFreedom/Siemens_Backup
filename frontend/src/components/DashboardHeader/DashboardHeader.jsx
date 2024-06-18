import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import logo from '../../assets/logo.png'; // Ensure the path to the logo is correct
import './DashboardHeader.css';

const DashboardHeader = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleEditAccount = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/account/generate-otp`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        navigate('/otp-account'); // Navigate to OTP account page
      }
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
