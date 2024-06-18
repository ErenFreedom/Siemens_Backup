import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Account.css';

const Account = () => {
  const { userId } = useParams();
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Fetch current user details and set them
    axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}`)
      .then(response => {
        const user = response.data;
        setCurrentUsername(user.username);
        setCurrentEmail(user.email);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  }, [userId]);

  const handleSaveChanges = () => {
    // Implement save changes logic here
    console.log('Saving changes:', { newUsername, newEmail, currentPassword, newPassword, confirmPassword });
  };

  return (
    <div className="account-page-container">
      <div className="account-form">
        <h2>Edit Account</h2>

        <label htmlFor="currentUsername">Current Username:</label>
        <input
          type="text"
          id="currentUsername"
          value={currentUsername}
          disabled
        />

        <label htmlFor="newUsername">New Username:</label>
        <input
          type="text"
          id="newUsername"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />

        <label htmlFor="currentEmail">Current Registered Email:</label>
        <input
          type="email"
          id="currentEmail"
          value={currentEmail}
          disabled
        />

        <label htmlFor="newEmail">New Email:</label>
        <input
          type="email"
          id="newEmail"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />

        <label htmlFor="currentPassword">Current Password:</label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label htmlFor="confirmPassword">Confirm New Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleSaveChanges}>Save Changes</button>
      </div>
    </div>
  );
};

export default Account;
