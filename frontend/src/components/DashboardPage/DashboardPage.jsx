import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode'; // Correct import for jwt-decode
import io from 'socket.io-client';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import './DashboardPage.css';

const DashboardPage = () => {
  const { userId } = useParams();
  const [username, setUsername] = useState('');
  const [temperatureData, setTemperatureData] = useState({ value: '', updatedAt: '' });
  const [pressureData, setPressureData] = useState({ value: '', updatedAt: '' });
  const [rhData, setRhData] = useState({ value: '', updatedAt: '' });
  const [humidityData, setHumidityData] = useState({ value: '', updatedAt: '' });
  const socket = io(process.env.REACT_APP_API_URL); // Adjust according to your server URL

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      // Use userId for further API calls
    }

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

    // Function to fetch the latest data
    const fetchLatestData = async () => {
      try {
        const response = await fetch('/api/latest', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTemperatureData(data.temp);
        setPressureData(data.pressure);
        setRhData(data.rh);
        setHumidityData(data.humidity);
      } catch (error) {
        console.error('Error fetching latest data:', error);
      }
    };

    fetchUserDetails();
    fetchLatestData();

    // Listen for real-time updates
    socket.on('data_update', (update) => {
      const { table, data } = update;
      switch (table) {
        case 'temp':
          setTemperatureData(data);
          break;
        case 'pressure':
          setPressureData(data);
          break;
        case 'rh':
          setRhData(data);
          break;
        case 'humidity':
          setHumidityData(data);
          break;
        default:
          break;
      }
    });

    return () => {
      socket.disconnect();
    };
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
