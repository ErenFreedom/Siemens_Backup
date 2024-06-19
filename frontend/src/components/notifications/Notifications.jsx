import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../actions/notificationActions';
import './Notifications.css';

const Notifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(fetchNotifications(token));
    }
  }, [dispatch]);

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
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
      <button className="back-button" onClick={() => window.history.back()}>Back to Dashboard</button>
    </div>
  );
};

export default Notifications;
