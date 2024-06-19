import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, addNotification } from '../../actions/notificationActions';
import axios from 'axios';
import io from 'socket.io-client';
import logo from '../../assets/logo.png';
import './DashboardHeader.css';

const DashboardHeader = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector((state) => state.notifications.notifications);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    dispatch(fetchNotifications(token));

    const socket = io(process.env.REACT_APP_API_URL, {
      auth: { token },
    });

    socket.on('alarm', (data) => {
      dispatch(addNotification({
        type: 'threshold_breach',
        message: `Alert: ${data.table} value of ${data.value} exceeded threshold at ${data.timestamp}`,
        timestamp: data.timestamp,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

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

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <div className="dashboard-header-container">
      <div className="dashboard-logo-container">
        <img src={logo} className="dashboard-logo" alt="Platform Logo" />
      </div>
      <h1 className="intelli-monitor-heading">IntelliMonitor</h1>
      <div className="dashboard-header-options">
        <div className="dashboard-notification-dropdown" onClick={handleNotificationClick}>
          <FaBell className={`dashboard-icon ${notifications.length > 0 ? 'new-notification' : ''}`} />
        </div>
        <div className="dashboard-report-button">
          <Link to={`/report/${userId}`}>
            <button>Generate Report</button>
          </Link>
        </div>
        <div className="dashboard-profile-dropdown">
          <FaUserCircle className="dashboard-icon" />
          <div className="dashboard-dropdown-content">
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
