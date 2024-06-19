import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../reducers/notificationSlice';
import './Notifications.css';

const NotificationPage = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const error = useSelector((state) => state.notifications.error);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(fetchNotifications(token));
    }
  }, [dispatch]);

  return (
    <div className="notification-page-container">
      <h1>Notifications</h1>
      {error && <p className="error">{error}</p>}
      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification, index) => (
            <li key={index} className={`notification-item ${notification.status}`}>
              <p>{notification.message}</p>
              <span>{new Date(notification.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => window.history.back()}>Back to Dashboard</button>
    </div>
  );
};

export default NotificationPage;
