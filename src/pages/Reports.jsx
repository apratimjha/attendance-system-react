// import React, { useState } from 'react';
// import ReportGenerator from '../components/ReportGenerator';
// import StatCard from '../components/StatCard';

// const Reports = ({ attendanceData }) => {
//   const [reportData, setReportData] = useState(null);

//   const generateReport = (startDate, endDate) => {
//     const filteredData = attendanceData.filter(entry => 
//       new Date(entry.date) >= new Date(startDate) && 
//       new Date(entry.date) <= new Date(endDate)
//     );

//     const totalDays = filteredData.length;

//     const presentDays = filteredData.filter(entry => entry.status === 'Present').length;
    
//     const averageAttendance = (presentDays / totalDays * 100).toFixed(2);
//     const bestDay = Math.max(...filteredData.map(entry => 
//       filteredData.filter(e => e.date === entry.date && e.status === 'Present').length
//     ));

//     setReportData({ totalDays, averageAttendance, bestDay });
//   };

//   return (
//     <div id="reports" className="tab-content">
//       <ReportGenerator onGenerate={generateReport} />
      
//       {reportData && (
//         <div className="card">
//           <h3>Attendance Summary</h3>
//           <div className="stats-container">
//             <StatCard title="Total Days" value={reportData.totalDays} />
//             <StatCard title="Average Attendance" value={`${reportData.averageAttendance}%`} />
//             <StatCard title="Best Day" value={`${reportData.bestDay} present`} />
//           </div>
          
//           <div className="chart-container">
//             <div className="chart-placeholder">
//               <p>Attendance chart will be displayed here</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Reports;





import React, { useState } from 'react';
import ReportGenerator from '../components/ReportGenerator';
import StatCard from '../components/StatCard';

const Reports = ({ attendanceData }) => {
  const [reportData, setReportData] = useState(null);

  const generateReport = (startDate, endDate, selectedStudent) => {
    let filteredData = attendanceData.filter(entry => 
      new Date(entry.date) >= new Date(startDate) && 
      new Date(entry.date) <= new Date(endDate)
    );

    if (selectedStudent !== 'All') {
      filteredData = filteredData.filter(entry => entry.name === selectedStudent);
    }

    // Calculate unique days in the date range
    const uniqueDays = [...new Set(filteredData.map(entry => entry.date))].length;
    
    // Count present and late entries (accounting for carriage returns)
    const presentCount = filteredData.filter(entry => 
      entry.status.trim() === 'Present' || 
      entry.status === 'Present\r'
    ).length;
    
    const lateCount = filteredData.filter(entry => 
      entry.status.trim() === 'Late' || 
      entry.status === 'Late\r'
    ).length;
    
    const totalPresent = presentCount + lateCount;
    
    // Calculate average attendance
    const totalEntries = selectedStudent === 'All' ? filteredData.length : uniqueDays;
    const averageAttendance = totalEntries > 0 ? 
      ((totalPresent / totalEntries) * 100).toFixed(2) : 
      "0.00";
    
    // Find the day with most attendances
    const dateAttendance = {};
    filteredData.forEach(entry => {
      if (entry.status.trim() === 'Present' || entry.status === 'Present\r' || 
          entry.status.trim() === 'Late' || entry.status === 'Late\r') {
        dateAttendance[entry.date] = (dateAttendance[entry.date] || 0) + 1;
      }
    });
    
    const bestDayCount = Object.values(dateAttendance).length > 0 ? 
      Math.max(...Object.values(dateAttendance)) : 0;

    setReportData({ 
      present: presentCount,
      totalDays: uniqueDays, 
      averageAttendance, 
      // bestDay: bestDayCount,
      student: selectedStudent
    });
  };

  return (
    <div id="reports" className="tab-content">
      <ReportGenerator 
        onGenerate={generateReport} 
        students={[...new Set(attendanceData.map(entry => entry.name))]}
      />
      
      {reportData && (
        <div className="card">
          <h3>Attendance Summary {reportData.student !== 'All' ? `for ${reportData.student}` : ''}</h3>
          <div className="stats-container">
            <StatCard title="Total Days" value={reportData.totalDays} />
            {/* <StatCard title="Average Attendance" value={`${reportData.averageAttendance}%`} /> */}
            <StatCard title="Average Attendance" value={`${(reportData.present * 100 / reportData.totalDays).toFixed(2)}%`} />
            <StatCard title="Days Present" value={`${reportData.present} present`} />
          </div>
          
          <div className="chart-container">
            <div className="chart-placeholder">
              <p>Attendance chart will be displayed here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

