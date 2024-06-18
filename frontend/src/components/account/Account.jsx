import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Account.css';

const Account = () => {
  const { userId } = useParams();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveChanges = () => {
    // Implement save changes logic here
    console.log('Saving changes:', { username, email, password, confirmPassword });
  };

  return (
    <div className="account-page-container">
      <div className="account-form">
        <h2>Edit Account</h2>

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="email">Registered Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">New Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirmPassword">Confirm Password:</label>
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
