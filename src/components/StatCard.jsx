import React from 'react';

const StatCard = ({ title, value }) => {
  return (
    <div className="stat-card">
      <h4>{title}</h4>
      <div className="stat-value">{value}</div>
    </div>
  );
};

export default StatCard;
