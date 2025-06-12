import React, { useState } from 'react';

const AttendanceFilter = ({ onFilter }) => {
  const [date, setDate] = useState('');

  const handleFilter = () => {
    onFilter(date);
  };

  return (
    <div className="filter-controls">
      <input 
        type="date" 
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="form-control"
      />
      <button onClick={handleFilter} className="btn btn-primary">Filter</button>
    </div>
  );
};

export default AttendanceFilter;
