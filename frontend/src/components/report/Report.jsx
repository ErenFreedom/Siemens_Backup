import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Report.css';

const Report = () => {
  const { userId } = useParams();
  const [mainFilter, setMainFilter] = useState('today');
  const [subFilter, setSubFilter] = useState('');

  const handleMainFilterChange = (event) => {
    setMainFilter(event.target.value);
    setSubFilter('');
  };

  const handleSubFilterChange = (event) => {
    setSubFilter(event.target.value);
  };

  const renderSubFilterOptions = () => {
    switch (mainFilter) {
      case 'today':
        return Array.from({ length: 24 }, (_, i) => (
          <option key={i + 1} value={`${i + 1}hour`}>Past {i + 1} hour</option>
        ));
      case 'week':
        return Array.from({ length: 7 }, (_, i) => (
          <option key={i + 1} value={`${i + 1}day`}>Past {i + 1} day</option>
        ));
      case 'month':
        return (
          <>
            {Array.from({ length: 30 }, (_, i) => (
              <option key={i + 1} value={`${i + 1}day`}>Past {i + 1} day</option>
            ))}
            <option value="fullMonth">Full Month</option>
          </>
        );
      default:
        return null;
    }
  };

  const generateReport = () => {
    // Implement report generation logic here
    console.log(`Generating report for ${mainFilter} with ${subFilter}`);
  };

  return (
    <div className="report-container">
      <h2>Generate Report for User {userId}</h2>
      <div className="filter-section">
        <label htmlFor="main-filter">Select Time Range:</label>
        <select id="main-filter" value={mainFilter} onChange={handleMainFilterChange}>
          <option value="today">Today</option>
          <option value="week">Last 1 Week</option>
          <option value="month">Last 1 Month</option>
        </select>
      </div>
      {mainFilter && (
        <div className="sub-filter-section">
          <label htmlFor="sub-filter">Select Specific Time:</label>
          <select id="sub-filter" value={subFilter} onChange={handleSubFilterChange}>
            <option value="">Select...</option>
            {renderSubFilterOptions()}
          </select>
        </div>
      )}
      <button onClick={generateReport} className="generate-report-button">Generate Report</button>
    </div>
  );
};

export default Report;
