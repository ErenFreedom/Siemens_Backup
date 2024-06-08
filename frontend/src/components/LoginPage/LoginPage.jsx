import React, { useEffect } from 'react';
import './LoginPage.css';
import logo from '../../assets/logo.png'; // Ensure the path to the logo is correct
import loginGif from '../../assets/login.gif'; // Ensure the path to the GIF is correct

const LoginPage = () => {
  useEffect(() => {
    document.body.classList.add('login-page-body');
    return () => {
      document.body.classList.remove('login-page-body');
    };
  }, []);

  return (
    <div className="login-page">
      <div className="header-container">
        <div className="logo-container">
          <img src={logo} className="logo" alt="Platform Logo" />
        </div>
        <h1>Welcome Back! Please Log In</h1>
      </div>
      <div className="login-content">
        <div className="login-form-container">
          <h2>Log In</h2>
          <form className="login-form">
            <label>
              Username or Email
              <input type="text" name="usernameOrEmail" placeholder="Enter your username or registered email" required />
            </label>
            <label>
              Password
              <input type="password" name="password" placeholder="Enter your password" required />
            </label>
            <button type="submit">Log In</button>
          </form>
          <p className="register-link">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
        <div className="gif-container">
          <img src={loginGif} alt="Login Animation" className="gif-image" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
