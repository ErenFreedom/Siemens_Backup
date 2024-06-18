import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Account.css';

const Account = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordPrompt, setPasswordPrompt] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    if (passwordPrompt) return;

    axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    })
      .then(response => {
        const user = response.data;
        setCurrentUsername(user.username);
        setCurrentEmail(user.email);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  }, [userId, passwordPrompt]);

  const handlePasswordCheck = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/check-password`, {
      password: passwordInput
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    })
      .then(() => {
        setPasswordPrompt(false);
      })
      .catch(error => {
        console.error('Error verifying password:', error);
        alert('Invalid password');
      });
  };

  const handleSaveChanges = () => {
    axios.put(`${process.env.REACT_APP_API_URL}/edit-account`, {
      email: newEmail || currentEmail,
      username: newUsername || currentUsername,
      currentPassword: passwordInput,
      newPassword
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    })
      .then(response => {
        alert('Account updated successfully');
        navigate(`/dashboard/${userId}`);
      })
      .catch(error => {
        console.error('Error updating account:', error);
        alert('Failed to update account');
      });
  };

  if (passwordPrompt) {
    return (
      <div className="password-prompt-container">
        <div className="password-prompt-form">
          <h2>Enter Current Password</h2>
          <input
            type="password"
            placeholder="Current Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button onClick={handlePasswordCheck}>Submit</button>
        </div>
      </div>
    );
  }

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
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          disabled
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
