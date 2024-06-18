import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Account.css';

const Account = () => {
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [currentUsername, setCurrentUsername] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCurrentUserDetails();
    }, []);

    const fetchCurrentUserDetails = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/account/current`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCurrentUsername(response.data.username);
            setCurrentEmail(response.data.email);
        } catch (error) {
            console.error('Error fetching current user details:', error);
        }
    };

    const handleEditAccount = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/account/edit`, {
                currentPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Account updated successfully:', response);
            navigate(`/dashboard/${response.data.userId}`); // Redirect to the dashboard
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    return (
        <div className="account-page-container">
            <div className="account-form">
                <h2>Edit Account</h2>
                <label>Current Username</label>
                <input
                    type="text"
                    value={currentUsername}
                    disabled
                />
                <label>Current Email</label>
                <input
                    type="email"
                    value={currentEmail}
                    disabled
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
            </div>
        </div>
    );
};

export default Account;
