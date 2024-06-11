import React, { useState, useEffect } from 'react';
import './OtpPage.css';
import logo from '../../assets/logo.png'; // Ensure the path to the logo is correct
import otpImage from '../../assets/otpimage.png'; // Ensure the path to the OTP image is correct

const OtpPage = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    document.body.classList.add('otp-page-body');
    return () => {
      document.body.classList.remove('otp-page-body');
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleResend = () => {
    setTimeLeft(120);
    setOtp(new Array(6).fill(""));
  };

  return (
    <div className="otp-page">
      <div className="header-container">
        <div className="logo-container">
          <img src={logo} className="logo" alt="Platform Logo" />
        </div>
        <h1> Verification Needed. . .</h1>
      </div>
      <div className="otp-content">
        <img src={otpImage} alt="OTP Verification" className="otp-image" />
        <h2>Verification Code</h2>
        <p>A six digit OTP has been sent to your registered email id. Please verify</p>
        <div className="otp-inputs">
          {otp.map((data, index) => (
            <input
              type="text"
              name="otp"
              maxLength="1"
              key={index}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>
        {timeLeft > 0 ? (
          <p>Resend in {timeLeft} sec</p>
        ) : (
          <p className="resend" onClick={handleResend}>
            Resend OTP
          </p>
        )}
        <button type="button" className="verify-button">VERIFY</button>
      </div>
    </div>
  );
};

export default OtpPage;