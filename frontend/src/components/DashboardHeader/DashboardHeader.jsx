import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import io from 'socket.io-client';
import logo from '../../assets/logo.png';
import './DashboardHeader.css';

const DashboardHeader = () => {
  const { userId } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL, {
      query: { token },
    });

    socket.on('alarm', (data) => {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          message: `Alarm: ${data.table} value of ${data.value} exceeded threshold at ${data.timestamp}`,
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const handleLogout = async () => {
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

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="header-container">
      <div className="logo-container">
        <img src={logo} className="logo" alt="Platform Logo" />
        <h1>IntelliMonitor</h1>
      </div>
      <div className="header-options">
        <div className="notification-dropdown" onClick={toggleDropdown}>
          <FaBell className="icon" />
          {notifications.length > 0 && (
            <span className="notification-count">{notifications.length}</span>
          )}
          {showDropdown && (
            <div className="dropdown-content show">
              {notifications.length === 0 ? (
                <p>No new notifications</p>
              ) : (
                notifications.map((notification, index) => (
                  <p key={index}>{notification.message}</p>
                ))
              )}
            </div>
          )}
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
