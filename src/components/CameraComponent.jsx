import React, { useState, useRef } from 'react';

const CameraComponent = ({ isAttendanceMode = false }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const imageUrl = canvas.toDataURL('image/png');
    setCapturedImages([...capturedImages, imageUrl]);
  };

  // Start camera automatically if in attendance mode
  React.useEffect(() => {
    if (isAttendanceMode) {
      startCamera();
    }
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isAttendanceMode]);

  return (
    <div>
      <div className="video-container">
        <video 
          ref={videoRef}
          autoPlay
          style={{ width: '100%', height: 'auto' }}
        ></video>
      </div>
      {!isAttendanceMode && (
        <div className="camera-controls">
          {!cameraActive ? (
            <button onClick={startCamera} className="btn btn-primary">Start Camera</button>
          ) : (
            <>
              <button onClick={captureImage} className="btn btn-success">Capture</button>
              <button onClick={stopCamera} className="btn btn-danger" style={{ marginLeft: '10px' }}>Stop Camera</button>
            </>
          )}
        </div>
      )}
      <div className="captured-images">
        {capturedImages.map((img, index) => (
          <img key={index} src={img} alt={`Captured ${index}`} style={{ width: '100px', height: '100px', margin: '5px', objectFit: 'cover' }} />
        ))}
      </div>
    </div>
  );
};

export default CameraComponent;






// import React, { useState, useRef, useEffect } from 'react';

// const CameraComponent = ({ isAttendanceMode = false, sessionStartTime = null }) => {
//   const [cameraActive, setCameraActive] = useState(false);
//   const [capturedImages, setCapturedImages] = useState([]);
//   const [recognizedFaces, setRecognizedFaces] = useState([]);
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;
//       streamRef.current = stream;
//       setCameraActive(true);
//     } catch (err) {
//       console.error('Error accessing camera:', err);
//     }
//   };

//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//       setCameraActive(false);
//     }
//   };

//   const captureImage = () => {
//     const canvas = document.createElement('canvas');
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
//     const imageUrl = canvas.toDataURL('image/png');
//     setCapturedImages([...capturedImages, imageUrl]);
//   };

//   // Determine attendance status based on time
//   const determineAttendanceStatus = () => {
//     if (!sessionStartTime) return 'Present';
    
//     const now = new Date();
//     const elapsedMinutes = (now - sessionStartTime) / (1000 * 60);
    
//     if (elapsedMinutes <= 20) {
//       return 'Present';
//     } else if (elapsedMinutes <= 90) {
//       return 'Late';
//     } else {
//       return 'Absent'; // After session ends
//     }
//   };

//   // Mock function to simulate face recognition
//   // In a real implementation, this would call your ML model
//   const recognizeFace = (imageData) => {
//     // This is where you would integrate with your ML model
//     // For now, we'll simulate recognition with a mock function
//     console.log('Face recognition would happen here');
    
//     // Simulate recognizing a student
//     const mockStudents = ['Basel Ali Khan', 'Sujal Khera', 'Apratim Jha', 'Shivansh Dixit'];
//     const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
    
//     // Check if student is already recognized in this session
//     if (!recognizedFaces.includes(randomStudent)) {
//       const status = determineAttendanceStatus();
//       setRecognizedFaces([...recognizedFaces, randomStudent]);
      
//       // In a real implementation, you would save this to your attendance.csv
//       console.log(`Recognized ${randomStudent} - Status: ${status}`);
      
//       // Show notification
//       alert(`Attendance marked for ${randomStudent}: ${status}`);
//     }
//   };

//   // Start camera automatically if in attendance mode
//   useEffect(() => {
//     if (isAttendanceMode) {
//       startCamera();
//     }
    
//     // Cleanup function to stop camera when component unmounts
//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [isAttendanceMode]);

//   // Simulate periodic face recognition when in attendance mode
//   useEffect(() => {
//     let recognitionInterval;
    
//     if (isAttendanceMode && cameraActive) {
//       // Simulate face recognition every 5 seconds
//       recognitionInterval = setInterval(() => {
//         if (videoRef.current && videoRef.current.readyState === 4) {
//           const canvas = document.createElement('canvas');
//           canvas.width = videoRef.current.videoWidth;
//           canvas.height = videoRef.current.videoHeight;
//           canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
//           const imageData = canvas.toDataURL('image/png');
          
//           recognizeFace(imageData);
//         }
//       }, 5000);
//     }
    
//     return () => clearInterval(recognitionInterval);
//   }, [isAttendanceMode, cameraActive, recognizedFaces]);

//   return (
//     <div>
//       <div className="video-container">
//         <video 
//           ref={videoRef}
//           autoPlay
//           style={{ width: '100%', height: 'auto' }}
//         ></video>
//       </div>
      
//       {isAttendanceMode && (
//         <div className="recognition-status">
//           <p>Recognized students: {recognizedFaces.length}</p>
//         </div>
//       )}
      
//       {!isAttendanceMode && (
//         <div className="camera-controls">
//           {!cameraActive ? (
//             <button onClick={startCamera} className="btn btn-primary">Start Camera</button>
//           ) : (
//             <>
//               <button onClick={captureImage} className="btn btn-success">Capture</button>
//               <button onClick={stopCamera} className="btn btn-danger" style={{ marginLeft: '10px' }}>Stop Camera</button>
//             </>
//           )}
//         </div>
//       )}
      
//       <div className="captured-images">
//         {capturedImages.map((img, index) => (
//           <img key={index} src={img} alt={`Captured ${index}`} style={{ width: '100px', height: '100px', margin: '5px', objectFit: 'cover' }} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CameraComponent;
