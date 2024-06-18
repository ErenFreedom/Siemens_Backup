import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import LoginPage from './components/LoginPage/LoginPage';
import OtpPage from './components/OtpPage/OtpPage';
import OtpLoginPage from './components/OtpPage/otpLoginPage';
import OtpAccountPage from './components/OtpPage/otpAccountPage'; // Import the new OTP Account Page
import DashboardPage from './components/DashboardPage/DashboardPage';
import Temperature from './components/ConfigTabs/Temperature';
import Pressure from './components/ConfigTabs/Pressure';
import Rh from './components/ConfigTabs/Rh';
import Humidity from './components/ConfigTabs/Humidity';
import Report from './components/report/Report';
import Account from './components/account/Account';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/otp-login" element={<OtpLoginPage />} />
        <Route path="/otp-account" element={<OtpAccountPage />} /> {/* Adding the new OTP Account route */}
        <Route path="/dashboard/:userId" element={<DashboardPage />} />
        <Route path="/temperature/:userId" element={<Temperature />} />
        <Route path="/pressure/:userId" element={<Pressure />} />
        <Route path="/rh/:userId" element={<Rh />} />
        <Route path="/humidity/:userId" element={<Humidity />} />
        <Route path="/report/:userId" element={<Report />} />
        <Route path="/edit-account/:userId" element={<Account />} />
      </Routes>
    </Router>
  );
}

export default App;
