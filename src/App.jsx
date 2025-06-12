// import React, { useState, useEffect } from 'react';
// import NavBar from './components/NavBar';
// import Dashboard from './pages/Dashboard';
// import Attendance from './pages/Attendance';
// import Register from './pages/Register';
// import Reports from './pages/Reports';
// import './index.css';

// function App() {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [attendanceData, setAttendanceData] = useState([]);

//   useEffect(() => {
//     // Fetch attendance data from CSV
//     fetch('/data/attendance.csv')
//       .then(response => response.text())
//       .then(csvText => {
//         const rows = csvText.split('\n').slice(1); // Skip header
//         const parsedData = rows.map(row => {
//           const [name, date, time, status] = row.split(',');
//           return { name, date, time, status };
//         });
//         setAttendanceData(parsedData);
//       });
//   }, []);

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'dashboard':
//         return <Dashboard attendanceData={attendanceData} />;
//       case 'attendance':
//         return <Attendance attendanceData={attendanceData} />;
//       case 'register':
//         return <Register />;
//       case 'reports':
//         return <Reports attendanceData={attendanceData} />;
//       default:
//         return <Dashboard attendanceData={attendanceData} />;
//     }
//   };

//   return (
//     <div className="container">
//       <header>
//         <h1>Smart Attendance System</h1>
//       </header>
//       <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
//       {renderContent()}
//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Register from './pages/Register';
import Reports from './pages/Reports';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get-attendance');
      const data = await response.json();
      if (data.success) {
        setAttendanceData(data.data);
      } else {
        console.error('Failed to fetch attendance data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchAttendanceData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard attendanceData={attendanceData} refreshAttendanceData={fetchAttendanceData} />;
      case 'attendance':
        return <Attendance attendanceData={attendanceData} />;
      case 'register':
        return <Register />;
      case 'reports':
        return <Reports attendanceData={attendanceData} />;
      default:
        return <Dashboard attendanceData={attendanceData} refreshAttendanceData={fetchAttendanceData} />;
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Smart Attendance System</h1>
      </header>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
}

export default App;
