import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add useNavigate hook
import axios from 'axios';
import './RegisterPage.css';
import logo from '../../assets/logo.png'; // Ensure the path to the logo is correct
import firstImage from '../../assets/image1.jpg'; // Update with actual image paths
import secondImage from '../../assets/image2.jpg'; // Update with actual image paths
import thirdImage from '../../assets/image3.jpg'; // Update with actual image paths

const RegisterPage = () => {
  const images = [firstImage, secondImage, thirdImage];
  const [currentImage, setCurrentImage] = React.useState(0);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    document.body.classList.add('register-page-body');
    return () => {
      document.body.classList.remove('register-page-body');
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, formData);
      setMessage(response.data);
      navigate('/otp'); // Navigate to OTP page upon successful registration
    } catch (error) {
      setError(error.response?.data || 'An error occurred');
    }
  };

  return (
    <div className="register-page">
      <div className="header-container">
        <div className="logo-container">
          <img src={logo} className="logo" alt="Platform Logo" />
        </div>
        <h1>Welcome to Our Platform - Register Now!</h1>
      </div>
      <div className="register-content">
        <div className="register-form-container">
          <h2>Create an account</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <label>
              Username
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
            </label>
            <label>
              Password
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
            </label>
            <button type="submit">Create</button>
          </form>
          {error && <p className="error">{error}</p>}
          {message && <p className="message">{message}</p>}
          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
        <div className="slideshow-container">
          <img src={images[currentImage]} alt="Slideshow" className="slideshow-image" />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
