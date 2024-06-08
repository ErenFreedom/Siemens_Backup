import React, { useEffect } from 'react';
import './RegisterPage.css';
import logo from '../../assets/logo.png'; // Ensure the path to the logo is correct
import firstImage from '../../assets/image1.jpg'; // Update with actual image paths
import secondImage from '../../assets/image2.jpg'; // Update with actual image paths
import thirdImage from '../../assets/image3.jpg'; // Update with actual image paths

const RegisterPage = () => {
  const images = [firstImage, secondImage, thirdImage];
  const [currentImage, setCurrentImage] = React.useState(0);

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
          <form className="register-form">
            <label>
              Username
              <input type="text" name="username" placeholder="Enter your username" required />
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="Enter your email" required />
            </label>
            <label>
              Password
              <input type="password" name="password" placeholder="Enter your password" required />
            </label>
            <button type="submit">Create</button>
          </form>
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
