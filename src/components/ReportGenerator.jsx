// import React, { useState } from 'react';

// const ReportGenerator = ({ onGenerate }) => {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   const handleGenerate = () => {
//     onGenerate(startDate, endDate);
//   };

//   return (
//     <div className="report-controls">
//       <input 
//         type="date" 
//         value={startDate}
//         onChange={(e) => setStartDate(e.target.value)}
//         className="form-control"
//       />
//       <input 
//         type="date" 
//         value={endDate}
//         onChange={(e) => setEndDate(e.target.value)}
//         className="form-control"
//       />
//       <button onClick={handleGenerate} className="btn btn-primary">Generate Report</button>
//     </div>
//   );
// };

// export default ReportGenerator;






import React, { useState } from 'react';

const ReportGenerator = ({ onGenerate, students }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('All');

  const handleGenerate = () => {
    if (startDate && endDate) {
      onGenerate(startDate, endDate, selectedStudent);
    } else {
      alert('Please select both start and end dates');
    }
  };

  return (
    <div className="report-controls">
      <input 
        type="date" 
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="form-control"
        placeholder="Start Date"
      />
      <input 
        type="date" 
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="form-control"
        placeholder="End Date"
      />
      <select 
        value={selectedStudent} 
        onChange={(e) => setSelectedStudent(e.target.value)}
        className="form-control"
      >
        <option value="All">All Students</option>
        {students.map(student => (
          <option key={student} value={student}>{student}</option>
        ))}
      </select>
      <button onClick={handleGenerate} className="btn btn-primary">Generate Report</button>
    </div>
  );
};

export default ReportGenerator;
