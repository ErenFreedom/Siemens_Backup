import React, { useState } from 'react';
import axios from 'axios';
import './Account.css';

const Account = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [verified, setVerified] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentUsername, setCurrentUsername] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');

    const verifyPassword = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/account/verify-password`, {
                password: currentPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setVerified(true);
                // Fetch current username and email after password verification
                const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCurrentUsername(userResponse.data.username);
                setCurrentEmail(userResponse.data.email);
            }
        } catch (error) {
            console.error('Error verifying password:', error);
        }
    };

    const handleEditAccount = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/account/edit`, {
                email: newEmail,
                username: newUsername
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Account updated successfully:', response);
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    const handleChangePassword = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/account/change-password`, {
                oldPassword: currentPassword,
                newPassword: newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Password changed successfully:', response);
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    return (
        <div className="account-page-container">
            {!verified ? (
                <div className="verify-password-form">
                    <h2>Enter Current Password</h2>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current Password"
                    />
                    <button onClick={verifyPassword}>Submit</button>
                </div>
            ) : (
                <div className="account-form">
                    <h2>Edit Account</h2>
                    <label>Current Username</label>
                    <input
                        type="text"
                        value={currentUsername}
                        disabled
                    />
                    <label>New Username</label>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="New Username"
                    />
                    <label>Current Email</label>
                    <input
                        type="email"
                        value={currentEmail}
                        disabled
                    />
                    <label>New Email</label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="New Email"
                    />
                    <label>Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current Password"
                    />
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                    />
                    <button onClick={handleEditAccount}>Save Changes</button>
                    <button onClick={handleChangePassword}>Change Password</button>
                </div>
            )}
        </div>
    );
};

export default Account;
