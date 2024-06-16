import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTempData } from '../../actions/dataActions';
import { Line } from 'react-chartjs-2';

const Temperature = () => {
  const [filter, setFilter] = useState('1day'); // Default filter
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.tempData);
  const error = useSelector((state) => state.data.error);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      dispatch(fetchTempData({ filter, token }));
    }
  }, [dispatch, filter, token]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div className="config-content">
      <h3>Temperature Details</h3>
      <select value={filter} onChange={handleFilterChange}>
        <option value="30min">Last 30 minutes</option>
        <option value="1hour">Last 1 hour</option>
        <option value="6hours">Last 6 hours</option>
        <option value="1day">Last 1 day</option>
        <option value="1week">Last 1 week</option>
        <option value="1month">Last 1 month</option>
      </select>
      {error && <p className="error">{error}</p>}
      {data ? (
        <>
          <Line
            data={{
              labels: data.data.map((d) => new Date(d.timestamp).toLocaleTimeString()),
              datasets: [
                {
                  label: 'Temperature',
                  data: data.data.map((d) => d.value),
                  fill: false,
                  backgroundColor: 'rgb(75, 192, 192)',
                  borderColor: 'rgba(75, 192, 192, 0.2)',
                },
              ],
            }}
            options={{
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'minute'
                  }
                }
              }
            }}
          />
          <div>
            <p>Average: {data.metrics.average}</p>
            <p>Max: {data.metrics.max}</p>
            <p>Min: {data.metrics.min}</p>
            <p>Range: {data.metrics.range}</p>
            <p>Variance: {data.metrics.variance}</p>
            <p>Standard Deviation: {data.metrics.stddev}</p>
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Temperature;
