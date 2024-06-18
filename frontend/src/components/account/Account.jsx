import React, { useState } from 'react';
import axios from 'axios';
import './Account.css';

const Account = () => {
    const [otp, setOtp] = useState('');
    const [verified, setVerified] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentUsername, setCurrentUsername] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');

    const generateOTP = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/account/generate-otp`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error generating OTP:', error);
        }
    };

    const verifyOTP = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/account/verify-otp`, {
                otp
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setVerified(true);
                // Fetch current username and email after OTP verification
                const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
                    params: { email: response.data.email }
                });
                setCurrentUsername(userResponse.data.username);
                setCurrentEmail(userResponse.data.email);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };

    const handleEditAccount = async () => {
        try {
            const token = localStorage.getItem('authToken');
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

    return (
        <div className="account-page-container">
            {!verified ? (
                <div className="otp-verification-form">
                    <h2>Enter OTP</h2>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="OTP"
                    />
                    <button onClick={verifyOTP}>Verify OTP</button>
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
                    <button onClick={handleEditAccount}>Save Changes</button>
                </div>
            )}
        </div>
    );
};

export default Account;
