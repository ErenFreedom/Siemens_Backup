import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTempData } from '../../actions/dataActions';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

const Temperature = () => {
  const dispatch = useDispatch();
  const { tempData, error } = useSelector((state) => state.data);
  const [filter, setFilter] = React.useState('30min');

  useEffect(() => {
    const token = localStorage.getItem('token');
    dispatch(fetchTempData({ filter, token }));
  }, [dispatch, filter]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const data = {
    labels: tempData?.data?.map((entry) => formatDate(entry.timestamp)) || [],
    datasets: [
      {
        label: 'Temperature',
        data: tempData?.data?.map((entry) => entry.value) || [],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="config-content">
      <h3>Temperature Details</h3>
      {error && <p>Error: {error}</p>}
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="30min">Last 30 minutes</option>
        <option value="1hour">Last 1 hour</option>
        <option value="6hours">Last 6 hours</option>
        <option value="1day">Last 1 day</option>
        <option value="1week">Last 1 week</option>
        <option value="1month">Last 1 month</option>
      </select>
      {tempData ? (
        <>
          <Line data={data} options={options} />
          <div>
            <p>Average: {tempData.metrics.average}</p>
            <p>Max: {tempData.metrics.max}</p>
            <p>Min: {tempData.metrics.min}</p>
            <p>Range: {tempData.metrics.range}</p>
            <p>Variance: {tempData.metrics.variance}</p>
            <p>Standard Deviation: {tempData.metrics.stddev}</p>
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Temperature;
