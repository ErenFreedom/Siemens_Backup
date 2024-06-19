import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const notifications = useSelector((state) => state.notifications.notifications);

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>No notifications available</p>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} className="notification-item">
              <p>{notification.message}</p>
              <span>{new Date(notification.timestamp).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
      <Link to="/dashboard">
        <button className="back-to-dashboard">Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default Notifications;
