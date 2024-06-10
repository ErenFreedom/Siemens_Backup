import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import './DashboardPage.css';

const DashboardPage = () => {
  const { userId } = useParams();
  const [username, setUsername] = useState('');
  const [temperatureData, setTemperatureData] = useState({ value: '', updatedAt: '' });
  const [pressureData, setPressureData] = useState({ value: '', updatedAt: '' });
  const [rhData, setRhData] = useState({ value: '', updatedAt: '' });
  const [humidityData, setHumidityData] = useState({ value: '', updatedAt: '' });

  useEffect(() => {
    // Function to fetch user details
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    // Functions to fetch data from the database
    const fetchTemperatureData = async () => {
      try {
        const response = await fetch('/api/temperature');
        const data = await response.json();
        setTemperatureData({ value: data.value, updatedAt: data.updatedAt });
      } catch (error) {
        console.error('Error fetching temperature data:', error);
      }
    };

    const fetchPressureData = async () => {
      try {
        const response = await fetch('/api/pressure');
        const data = await response.json();
        setPressureData({ value: data.value, updatedAt: data.updatedAt });
      } catch (error) {
        console.error('Error fetching pressure data:', error);
      }
    };

    const fetchRhData = async () => {
      try {
        const response = await fetch('/api/rh');
        const data = await response.json();
        setRhData({ value: data.value, updatedAt: data.updatedAt });
      } catch (error) {
        console.error('Error fetching RH data:', error);
      }
    };

    const fetchHumidityData = async () => {
      try {
        const response = await fetch('/api/humidity');
        const data = await response.json();
        setHumidityData({ value: data.value, updatedAt: data.updatedAt });
      } catch (error) {
        console.error('Error fetching humidity data:', error);
      }
    };

    fetchUserDetails();
    fetchTemperatureData();
    fetchPressureData();
    fetchRhData();
    fetchHumidityData();
  }, [userId]);

  return (
    <div className="dashboard-page-container">
      <DashboardHeader />
      <div className="welcome-container">
        <h2 className="welcome-message">Welcome to your dashboard, {username}</h2>
      </div>
      <div className="dashboard-page">
        <div className="dashboard-content">
          <div className="rectangles">
            <Link to={`/temperature/${userId}`} className="rectangle-link">
              <div className="rectangle">
                <p>Current Temperature: {temperatureData.value}</p>
                <p>Updated At: {temperatureData.updatedAt}</p>
              </div>
            </Link>
            <Link to={`/pressure/${userId}`} className="rectangle-link">
              <div className="rectangle">
                <p>Current Pressure: {pressureData.value}</p>
                <p>Updated At: {pressureData.updatedAt}</p>
              </div>
            </Link>
            <Link to={`/rh/${userId}`} className="rectangle-link">
              <div className="rectangle">
                <p>Current Rh: {rhData.value}</p>
                <p>Updated At: {rhData.updatedAt}</p>
              </div>
            </Link>
            <Link to={`/humidity/${userId}`} className="rectangle-link">
              <div className="rectangle">
                <p>Current Humidity: {humidityData.value}</p>
                <p>Updated At: {humidityData.updatedAt}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
