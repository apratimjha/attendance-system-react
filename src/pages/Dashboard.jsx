// import React, { useState, useEffect } from 'react';
// import StatCard from '../components/StatCard';
// import AttendanceTable from '../components/AttendanceTable';

// const Dashboard = ({ attendanceData, refreshAttendanceData }) => {
//     const [sessionStatus, setSessionStatus] = useState('idle');
//     const [timeRemaining, setTimeRemaining] = useState(0);
//     const [sessionMessage, setSessionMessage] = useState('');
//     const [sessionStart, setSessionStart] = useState('');
//     const [existingSession, setExistingSession] = useState(null);

//     useEffect(() => {
//         const checkExistingSession = async () => {
//             try {
//                 const response = await fetch('http://localhost:5000/api/check-session');
//                 const data = await response.json();
//                 if (data.hasSession) setExistingSession(data.startTime);
//             } catch (error) {
//                 console.error('Error checking session:', error);
//             }
//         };
//         checkExistingSession();
//     }, []);

//     const startAttendance = async () => {
//         if (!sessionStart) {
//             setSessionMessage('Please select session start time');
//             return;
//         }

//         try {
//             const response = await fetch('http://localhost:5000/api/start-attendance', {
//                 method: 'POST',
//                 headers: {'Content-Type': 'application/json'},
//                 body: JSON.stringify({ sessionStart: new Date(sessionStart).toISOString() })
//             });
            
//             const data = await response.json();
//             if (!data.success) throw new Error(data.error);
            
//             setSessionStatus('active');
//             setTimeRemaining(100 * 60);
//             setSessionMessage(`Session started at ${new Date(sessionStart).toLocaleString()}`);
//             refreshAttendanceData();
            
//         } catch (error) {
//             setSessionMessage(error.message);
//             setSessionStatus('idle');
//         }
//     };

//     const stopAttendance = async () => {
//         try {
//             await fetch('http://localhost:5000/api/stop-attendance', { method: 'POST' });
//             setSessionStatus('ended');
//             setSessionMessage('Session ended');
//             refreshAttendanceData();
//         } catch (error) {
//             console.error('Error stopping attendance:', error);
//         }
//     };

//     // useEffect(() => {
//     //     let timer;
//     //     if (sessionStatus === 'active' && timeRemaining > 0) {
//     //         timer = setInterval(() => {
//     //             setTimeRemaining(prev => {
//     //                 const newTime = prev - 1;
//     //                 if (newTime <= 0) stopAttendance();
//     //                 return newTime > 0 ? newTime : 0;
//     //             });
//     //         }, 1000);
//     //     }
//     //     return () => clearInterval(timer);
//     // }, [sessionStatus, timeRemaining]);

//     // Add this useEffect for session checking
// useEffect(() => {
//   const checkSession = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/check-session');
//       const data = await response.json();
//       if (data.hasSession) {
//         setExistingSession(data.startTime);
//         setSessionStatus('active');
//         const sessionStart = new Date(data.startTime);
//         const now = new Date();
//         const diff = (now - sessionStart) / 1000; // seconds
//         setTimeRemaining(Math.max(100*60 - Math.floor(diff), 0));
//       }
//     } catch (error) {
//       console.error('Session check error:', error);
//     }
//   };
//   checkSession();
// }, []);


//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     };

//     const todayAttendance = attendanceData.filter(entry => 
//         new Date(entry.date).toDateString() === new Date().toDateString()
//     );

//     return (
//         <div className="tab-content active">
//             <div className="stats-container">
//                 <StatCard title="Today's Attendance" 
//                     value={`${(todayAttendance.length ? 
//                         (todayAttendance.filter(e => e.status === 'Present' || e.status === 'Late').length / 
//                         todayAttendance.length * 100).toFixed(2) : 0)}%`} 
//                 />
//                 <StatCard title="Present Today" 
//                     value={todayAttendance.filter(e => e.status === 'Present').length} 
//                 />
//             </div>

//             {!existingSession ? (
//                 <div className="attendance-controls">
//                     <input
//                         type="datetime-local"
//                         value={sessionStart}
//                         onChange={(e) => setSessionStart(e.target.value)}
//                         className="form-control"
//                     />
//                     <button onClick={startAttendance} className="btn btn-primary">
//                         Start New Session
//                     </button>
//                 </div>
//             ) : (
//                 <div className="session-info">
//                     <p>{sessionMessage || `Active session started at ${new Date(existingSession).toLocaleString()}`}</p>
//                     <p>Time remaining: {formatTime(timeRemaining)}</p>
//                     <button onClick={stopAttendance} className="btn btn-danger">
//                         End Session
//                     </button>
//                 </div>
//             )}

//             <div className="card">
//                 <h3>Recent Entries</h3>
//                 <AttendanceTable data={attendanceData.slice(-5).reverse()} />
//             </div>
//         </div>
//     );
// };

// export default Dashboard;







// import React, { useState, useEffect } from 'react';
// import StatCard from '../components/StatCard';
// import AttendanceTable from '../components/AttendanceTable';

// const Dashboard = ({ attendanceData, refreshAttendanceData }) => {
//     const [sessionStatus, setSessionStatus] = useState('idle');
//     const [timeRemaining, setTimeRemaining] = useState(0);
//     const [sessionMessage, setSessionMessage] = useState('');
//     const [sessionStart, setSessionStart] = useState('');
//     const [existingSession, setExistingSession] = useState(null);
//     const [cameraActive, setCameraActive] = useState(false);

//     useEffect(() => {
//         const checkSession = async () => {
//             try {
//                 const response = await fetch('http://localhost:5000/api/check-session');
//                 const data = await response.json();
//                 if (data.hasSession) {
//                     setExistingSession(data.startTime);
//                     setSessionStatus('active');
//                     const sessionStartTime = new Date(data.startTime);
//                     const now = new Date();
//                     const diff = (now - sessionStartTime) / 1000;
//                     setTimeRemaining(Math.max(100*60 - Math.floor(diff), 0));
//                 }
//             } catch (error) {
//                 console.error('Session check error:', error);
//             }
//         };
//         checkSession();
//     }, []);

//     const startSession = async () => {
//         if (!sessionStart) {
//             setSessionMessage('Please select session start time');
//             return;
//         }

//         try {
//             const response = await fetch('http://localhost:5000/api/start-session', {
//                 method: 'POST',
//                 headers: {'Content-Type': 'application/json'},
//                 body: JSON.stringify({ sessionStart: new Date(sessionStart).toISOString() })
//             });
            
//             const data = await response.json();
//             if (!data.success) throw new Error(data.error);
            
//             setSessionStatus('active');
//             setExistingSession(new Date(sessionStart).toISOString());
//             setTimeRemaining(100 * 60);
//             setSessionMessage(`Session started at ${new Date(sessionStart).toLocaleString()}`);
//             refreshAttendanceData();
            
//         } catch (error) {
//             setSessionMessage(error.message);
//             setSessionStatus('idle');
//         }
//     };

//     const toggleCamera = async () => {
//         try {
//             if (cameraActive) {
//                 await fetch('http://localhost:5000/api/stop-camera', { method: 'POST' });
//                 setCameraActive(false);
//             } else {
//                 const response = await fetch('http://localhost:5000/api/start-camera', { method: 'POST' });
//                 const data = await response.json();
//                 if (data.success) setCameraActive(true);
//             }
//         } catch (error) {
//             console.error('Camera toggle error:', error);
//         }
//     };

//     const endSession = async () => {
//         try {
//             await fetch('http://localhost:5000/api/end-session', { method: 'POST' });
//             setSessionStatus('ended');
//             setExistingSession(null);
//             setCameraActive(false);
//             setSessionMessage('Session ended completely');
//             refreshAttendanceData();
//         } catch (error) {
//             console.error('Error ending session:', error);
//         }
//     };

//     useEffect(() => {
//         let timer;
//         if (sessionStatus === 'active' && timeRemaining > 0) {
//             timer = setInterval(() => {
//                 setTimeRemaining(prev => {
//                     const newTime = prev - 1;
//                     if (newTime <= 0) endSession();
//                     return newTime > 0 ? newTime : 0;
//                 });
//             }, 1000);
//         }
//         return () => clearInterval(timer);
//     }, [sessionStatus, timeRemaining]);

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     };

//     const todayAttendance = attendanceData.filter(entry => 
//         new Date(entry.date).toDateString() === new Date().toDateString()
//     );

//     return (
//         <div className="tab-content active">
//             <div className="stats-container">
//                 <StatCard 
//                     title="Today's Attendance" 
//                     value={`${(todayAttendance.length ? 
//                         (todayAttendance.filter(e => e.status === 'Present' || e.status === 'Late').length / 
//                         todayAttendance.length * 100).toFixed(2) : 0)}%`} 
//                 />
//                 <StatCard 
//                     title="Present Today" 
//                     value={todayAttendance.filter(e => e.status === 'Present').length} 
//                 />
//             </div>

//             {existingSession ? (
//                 <div className="session-controls">
//                     <div className="session-info">
//                         <p>Active session started at {new Date(existingSession).toLocaleString()}</p>
//                         <p>Time remaining: {formatTime(timeRemaining)}</p>
//                     </div>
                    
//                     <div className="button-group">
//                         <button 
//                             onClick={toggleCamera} 
//                             className={`btn ${cameraActive ? 'btn-warning' : 'btn-success'}`}
//                         >
//                             {cameraActive ? 'Close Camera' : 'Open Camera'}
//                         </button>
//                         <button onClick={endSession} className="btn btn-danger">
//                             End Session
//                         </button>
//                     </div>
                    
//                     <p className="camera-status">
//                         {sessionMessage || `Camera status: ${cameraActive ? 'Active' : 'Inactive'}`}
//                     </p>
//                 </div>
//             ) : (
//                 <div className="new-session">
//                     <input
//                         type="datetime-local"
//                         value={sessionStart}
//                         onChange={(e) => setSessionStart(e.target.value)}
//                         className="form-control"
//                     />
//                     <button 
//                         onClick={startSession} 
//                         className="btn btn-primary"
//                         disabled={!sessionStart}
//                     >
//                         Start New Session
//                     </button>
//                     {sessionMessage && <div className="alert alert-info">{sessionMessage}</div>}
//                 </div>
//             )}

//             <div className="card">
//                 <h3>Recent Entries</h3>
//                 <AttendanceTable data={attendanceData.slice(-5).reverse()} />
//             </div>
//         </div>
//     );
// };

// export default Dashboard;













// import React, { useState, useEffect } from 'react';
// import StatCard from '../components/StatCard';
// import AttendanceTable from '../components/AttendanceTable';

// const Dashboard = ({ attendanceData, refreshAttendanceData }) => {
//     const [sessionStatus, setSessionStatus] = useState('idle');
//     const [timeRemaining, setTimeRemaining] = useState(0);
//     const [sessionMessage, setSessionMessage] = useState('');
//     const [sessionStart, setSessionStart] = useState('');
//     const [existingSession, setExistingSession] = useState(null);
//     const [cameraActive, setCameraActive] = useState(false);

//     useEffect(() => {
//         const checkSession = async () => {
//             try {
//                 const response = await fetch('http://localhost:5000/api/check-session');
//                 const data = await response.json();
//                 if (data.hasSession) {
//                     setExistingSession(data.startTime);
//                     setSessionStatus('active');
//                     const sessionStartTime = new Date(data.startTime);
//                     const now = new Date();
//                     const diff = (now - sessionStartTime) / 1000;
//                     setTimeRemaining(Math.max(100*60 - Math.floor(diff), 0));
//                 }
//             } catch (error) {
//                 console.error('Session check error:', error);
//             }
//         };
//         checkSession();
//     }, []);

//     const startSession = async () => {
//         if (!sessionStart) {
//             setSessionMessage('Please select session start time');
//             return;
//         }

//         try {
//             const response = await fetch('http://localhost:5000/api/start-session', {
//                 method: 'POST',
//                 headers: {'Content-Type': 'application/json'},
//                 body: JSON.stringify({ sessionStart: new Date(sessionStart).toISOString() })
//             });
            
//             const data = await response.json();
//             if (!data.success) throw new Error(data.error);
            
//             setSessionStatus('active');
//             setExistingSession(new Date(sessionStart).toISOString());
//             setTimeRemaining(100 * 60);
//             setSessionMessage(`Session started at ${new Date(sessionStart).toLocaleString()}`);
//             refreshAttendanceData();
            
//         } catch (error) {
//             setSessionMessage(error.message);
//             setSessionStatus('idle');
//         }
//     };

//     const toggleCamera = async () => {
//         try {
//             if (cameraActive) {
//                 await fetch('http://localhost:5000/api/stop-camera', { method: 'POST' });
//                 setCameraActive(false);
//             } else {
//                 const response = await fetch('http://localhost:5000/api/start-camera', { method: 'POST' });
//                 const data = await response.json();
//                 if (data.success) setCameraActive(true);
//             }
//         } catch (error) {
//             console.error('Camera toggle error:', error);
//         }
//     };

//     const endSession = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/api/end-session', { method: 'POST' });
//             const data = await response.json();
//             if (data.success) {
//                 setSessionStatus('ended');
//                 setExistingSession(null);
//                 setCameraActive(false);
//                 setSessionMessage('Session ended completely');
//                 refreshAttendanceData();
//             }
//         } catch (error) {
//             console.error('Error ending session:', error);
//         }
//     };

//     useEffect(() => {
//         let timer;
//         if (sessionStatus === 'active' && timeRemaining > 0) {
//             timer = setInterval(() => {
//                 setTimeRemaining(prev => {
//                     const newTime = prev - 1;
//                     if (newTime <= 0) endSession();
//                     return newTime > 0 ? newTime : 0;
//                 });
//             }, 1000);
//         }
//         return () => clearInterval(timer);
//     }, [sessionStatus, timeRemaining]);

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     };

//     // Calculate statistics
//     const presentStudents = attendanceData.filter(entry => 
//         entry.status === 'Present' || entry.status === 'Late'
//     );
    
//     const absentStudents = attendanceData.filter(entry => 
//         entry.status === 'Absent' || entry.date === 'NA'
//     );

//     const totalStudents = attendanceData.length;
//     const attendancePercentage = existingSession ? 
//         ((presentStudents.length / totalStudents) * 100).toFixed(2) : 'N/A';

//     return (
//         <div className="tab-content active">
//             <div className="stats-container">
//                 <StatCard 
//                     title="Today's Attendance" 
//                     value={attendancePercentage}
//                     subtext={!existingSession && "Start session to begin tracking"}
//                 />
//                 <StatCard 
//                     title="Present Today" 
//                     value={existingSession ? presentStudents.length : 'N/A'}
//                 />
//                 <StatCard 
//                     title="Absent Today" 
//                     value={existingSession ? absentStudents.length : 'N/A'}
//                 />
//             </div>

//             {existingSession ? (
//                 <div className="session-controls">
//                     <div className="session-info">
//                         <p>Active session started at {new Date(existingSession).toLocaleString()}</p>
//                         <p>Time remaining: {formatTime(timeRemaining)}</p>
//                     </div>
                    
//                     <div className="button-group">
//                         <button 
//                             onClick={toggleCamera} 
//                             className={`btn ${cameraActive ? 'btn-warning' : 'btn-success'}`}
//                         >
//                             {cameraActive ? 'Close Camera' : 'Open Camera'}
//                         </button>
//                         <button onClick={endSession} className="btn btn-danger">
//                             End Session
//                         </button>
//                     </div>
                    
//                     <p className="camera-status">
//                         {sessionMessage || `Camera status: ${cameraActive ? 'Active' : 'Inactive'}`}
//                     </p>
//                 </div>
//             ) : (
//                 <div className="new-session">
//                     <input
//                         type="datetime-local"
//                         value={sessionStart}
//                         onChange={(e) => setSessionStart(e.target.value)}
//                         className="form-control"
//                     />
//                     <button 
//                         onClick={startSession} 
//                         className="btn btn-primary"
//                         disabled={!sessionStart}
//                     >
//                         Start New Session
//                     </button>
//                     {sessionMessage && <div className="alert alert-info">{sessionMessage}</div>}
//                 </div>
//             )}

//             <div className="card">
//                 <h3>Recent Entries</h3>
//                 <AttendanceTable 
//                     data={attendanceData
//                         .filter(entry => entry.status !== 'Absent')
//                         .slice(-5)
//                         .reverse()} 
//                 />
//             </div>
//         </div>
//     );
// };

// export default Dashboard;





import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import AttendanceTable from '../components/AttendanceTable';

const Dashboard = ({ attendanceData, refreshAttendanceData }) => {
    const [sessionStatus, setSessionStatus] = useState('idle');
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [sessionMessage, setSessionMessage] = useState('');
    const [sessionStart, setSessionStart] = useState('');
    const [existingSession, setExistingSession] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/check-session');
                const data = await response.json();
                if (data.hasSession) {
                    setExistingSession(data.startTime);
                    setSessionStatus('active');
                    const sessionStartTime = new Date(data.startTime);
                    const now = new Date();
                    const diff = (now - sessionStartTime) / 1000;
                    setTimeRemaining(Math.max(100*60 - Math.floor(diff), 0));
                }
            } catch (error) {
                console.error('Session check error:', error);
            }
        };
        checkSession();
    }, []);

    const startSession = async () => {
        if (!sessionStart) {
            setSessionMessage('Please select session start time');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/start-session', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ sessionStart: new Date(sessionStart).toISOString() })
            });
            
            const data = await response.json();
            if (!data.success) throw new Error(data.error);
            
            setSessionStatus('active');
            setExistingSession(new Date(sessionStart).toISOString());
            setTimeRemaining(100 * 60);
            setSessionMessage(`Session started at ${new Date(sessionStart).toLocaleString()}`);
            refreshAttendanceData();
            
        } catch (error) {
            setSessionMessage(error.message);
            setSessionStatus('idle');
        }
    };

    const toggleCamera = async () => {
        try {
            if (cameraActive) {
                await fetch('http://localhost:5000/api/stop-camera', { method: 'POST' });
                setCameraActive(false);
            } else {
                const response = await fetch('http://localhost:5000/api/start-camera', { method: 'POST' });
                const data = await response.json();
                if (data.success) setCameraActive(true);
            }
        } catch (error) {
            console.error('Camera toggle error:', error);
        }
    };

    const endSession = async () => {
        try {
            await fetch('http://localhost:5000/api/end-session', { method: 'POST' });
            setSessionStatus('ended');
            setExistingSession(null);
            setCameraActive(false);
            setSessionMessage('Session ended completely');
            refreshAttendanceData();
        } catch (error) {
            console.error('Error ending session:', error);
        }
    };

    useEffect(() => {
        let timer;
        if (sessionStatus === 'active' && timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining(prev => {
                    const newTime = prev - 1;
                    if (newTime <= 0) endSession();
                    return newTime > 0 ? newTime : 0;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [sessionStatus, timeRemaining]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Auto-refresh data every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshAttendanceData();
        }, 5000);
        return () => clearInterval(interval);
    }, [refreshAttendanceData]);

    // Calculate statistics
    const today = new Date().toISOString().split('T')[0];
    const presentStudents = attendanceData.filter(entry => 
        (entry.status === 'Present' || entry.status === 'Late') && entry.date === today
    ).length;
    
    const totalStudents = attendanceData.filter(entry => 
        entry.date === today || entry.date === 'NA'
    ).length;
    
    const absentStudents = totalStudents - presentStudents;
    const attendancePercentage = totalStudents > 0 ? 
        ((presentStudents / totalStudents) * 100).toFixed(2) : '0.00';

    return (
        <div className="tab-content active">
            <div className="stats-container">
                <StatCard 
                    title="Today's Attendance" 
                    value={`${attendancePercentage}%`}
                    subtext={!existingSession && "Session not started"}
                />
                <StatCard 
                    title="Present Today" 
                    value={presentStudents}
                />
                <StatCard 
                    title="Absent Today" 
                    value={absentStudents}
                />
            </div>

            {existingSession ? (
                <div className="session-controls">
                    <div className="session-info">
                        <p>Active session started at {new Date(existingSession).toLocaleString()}</p>
                        <p>Time remaining: {formatTime(timeRemaining)}</p>
                    </div>
                    
                    <div className="button-group">
                        <button 
                            onClick={toggleCamera} 
                            className={`btn ${cameraActive ? 'btn-warning' : 'btn-success'}`}
                        >
                            {cameraActive ? 'Close Camera' : 'Open Camera'}
                        </button>
                        <button onClick={endSession} className="btn btn-danger">
                            End Session
                        </button>
                    </div>
                    
                    <p className="camera-status">
                        {sessionMessage || `Camera status: ${cameraActive ? 'Active' : 'Inactive'}`}
                    </p>
                </div>
            ) : (
                <div className="new-session">
                    <input
                        type="datetime-local"
                        value={sessionStart}
                        onChange={(e) => setSessionStart(e.target.value)}
                        className="form-control"
                    />
                    <button 
                        onClick={startSession} 
                        className="btn btn-primary"
                        disabled={!sessionStart}
                    >
                        Start New Session
                    </button>
                    {sessionMessage && <div className="alert alert-info">{sessionMessage}</div>}
                </div>
            )}

            <div className="card">
                <h3>Recent Entries</h3>
                <AttendanceTable 
                    data={attendanceData
                        .filter(entry => entry.status !== 'Absent')
                        .slice(-5)
                        .reverse()} 
                />
            </div>
        </div>
    );
};

export default Dashboard;
