import React from 'react';

const AttendanceStatus = ({ present, absent, total }) => {
    return (
        <div className="attendance-status">
            <div className="status-bar">
                <div 
                    className="present-bar" 
                    style={{ width: `${(present / total) * 100}%` }}
                ></div>
                <div 
                    className="absent-bar"
                    style={{ width: `${(absent / total) * 100}%` }}
                ></div>
            </div>
            <div className="status-labels">
                <span>Present: {present}</span>
                <span>Absent: {absent}</span>
            </div>
        </div>
    );
};

export default AttendanceStatus;
