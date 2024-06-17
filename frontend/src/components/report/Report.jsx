import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Report.css';

const Report = () => {
  const { userId } = useParams();
  const [timeRange, setTimeRange] = useState('today');
  const [specificTime, setSpecificTime] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [table, setTable] = useState('');

  const handleGenerateReport = () => {
    // Implement report generation logic here
    console.log(`Generating report for User ${userId}`);
    console.log(`Table: ${table}`);
    console.log(`Time Range: ${timeRange}`);
    console.log(`Specific Time: ${specificTime}`);
    console.log(`Document Type: ${documentType}`);
  };

  return (
    <div className="report-page-container">
      <div className="report-form">
        <h2>Generate Report for User {userId}</h2>

        <label htmlFor="table">Select Table:</label>
        <select id="table" value={table} onChange={(e) => setTable(e.target.value)}>
          <option value="">Select...</option>
          <option value="temp">Temperature</option>
          <option value="pressure">Pressure</option>
          <option value="rh">Relative Humidity</option>
          <option value="humidity">Humidity</option>
        </select>

        <label htmlFor="timeRange">Select Time Range:</label>
        <select id="timeRange" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="today">Today</option>
          <option value="week">Last 1 Week</option>
          <option value="month">Last 1 Month</option>
        </select>

        <label htmlFor="specificTime">Select Specific Time:</label>
        <select id="specificTime" value={specificTime} onChange={(e) => setSpecificTime(e.target.value)}>
          <option value="">Select...</option>
          {timeRange === 'today' &&
            Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={`${i + 1}hour`}>{`Past ${i + 1} hour${i + 1 > 1 ? 's' : ''}`}</option>
            ))}
          {timeRange === 'week' &&
            Array.from({ length: 7 }, (_, i) => (
              <option key={i} value={`${i + 1}day`}>{`Past ${i + 1} day${i + 1 > 1 ? 's' : ''}`}</option>
            ))}
          {timeRange === 'month' && <option value="custom">Custom Date</option>}
        </select>

        <label htmlFor="documentType">Select Document Type:</label>
        <select id="documentType" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
          <option value="">Select...</option>
          <option value="pdf">PDF</option>
          <option value="xml">XML</option>
          <option value="excel">Excel</option>
          <option value="csv">CSV</option>
        </select>

        <button onClick={handleGenerateReport}>Generate Report</button>
      </div>
    </div>
  );
};

export default Report;
