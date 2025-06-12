import React, { useState } from 'react';
import AttendanceFilter from '../components/AttendanceFilter';
import AttendanceTable from '../components/AttendanceTable';

const Attendance = ({ attendanceData }) => {
  const [filteredData, setFilteredData] = useState(attendanceData);

  const handleFilter = (date) => {
    if (date) {
      setFilteredData(attendanceData.filter(entry => entry.date === date));
    } else {
      setFilteredData(attendanceData);
    }
  };

  return (
    <div id="attendance" className="tab-content">
      <AttendanceFilter onFilter={handleFilter} />
      <div className="card">
        <h3>Attendance Records</h3>
        <AttendanceTable data={filteredData} />
      </div>
    </div>
  );
};

export default Attendance;
