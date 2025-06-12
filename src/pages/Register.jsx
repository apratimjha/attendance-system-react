// import React, { useState, useRef } from 'react';
// import Webcam from 'react-webcam';

// const Register = () => {
//     const [name, setName] = useState('');
//     const [isCameraActive, setIsCameraActive] = useState(false);
//     const [registrationStatus, setRegistrationStatus] = useState('');
//     const [captureCount, setCaptureCount] = useState(0);
//     const webcamRef = useRef(null);

//     const startRegistration = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/api/start-registration', {
//                 method: 'POST',
//                 headers: {'Content-Type': 'application/json'},
//                 body: JSON.stringify({ name })
//             });
            
//             const data = await response.json();
//             if (!data.success) throw new Error(data.error || 'Registration failed');
            
//             setIsCameraActive(true);
//             setRegistrationStatus('Camera active - capture 20 images');
            
//         } catch (error) {
//             setRegistrationStatus(error.message);
//         }
//     };

//     const captureImage = async () => {
//         const imageSrc = webcamRef.current.getScreenshot();
        
//         const formData = new FormData();
//         formData.append('name', name);
//         formData.append('image', dataURLtoFile(imageSrc, 'capture.jpg'));

//         try {
//             const response = await fetch('http://localhost:5000/api/capture-image', {
//                 method: 'POST',
//                 body: formData
//             });
            
//             const data = await response.json();
//             if (!data.success) throw new Error('Capture failed');
            
//             setCaptureCount(prev => prev + 1);
//             setRegistrationStatus(`Captured ${captureCount + 1}/20 images`);
            
//         } catch (error) {
//             setRegistrationStatus(error.message);
//         }
//     };

//     const trainModel = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/api/train-model', {
//                 method: 'POST'
//             });
            
//             const data = await response.json();
//             setRegistrationStatus(data.success ? 
//                 "Model trained successfully!" : 
//                 "Training failed: " + (data.error || 'Unknown error'));
                
//         } catch (error) {
//             setRegistrationStatus("Training error: " + error.message);
//         }
//     };

//     const dataURLtoFile = (dataurl, filename) => {
//         const arr = dataurl.split(',');
//         const mime = arr[0].match(/:(.*?);/)[1];
//         const bstr = atob(arr[1]);
//         let n = bstr.length;
//         const u8arr = new Uint8Array(n);
//         while (n--) u8arr[n] = bstr.charCodeAt(n);
//         return new File([u8arr], filename, {type: mime});
//     };

//     return (
//         <div className="register-page">
//             <h2>Student Registration</h2>
            
//             {!isCameraActive ? (
//                 <div className="registration-form">
//                     <input
//                         type="text"
//                         placeholder="Enter student name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         className="form-control"
//                     />
//                     <button 
//                         onClick={startRegistration} 
//                         className="btn btn-primary"
//                         disabled={!name.trim()}
//                     >
//                         Start Registration
//                     </button>
//                 </div>
//             ) : (
//                 <div className="camera-section">
//                     <Webcam
//                         audio={false}
//                         ref={webcamRef}
//                         screenshotFormat="image/jpeg"
//                         width={640}
//                         height={480}
//                     />
                    
//                     <div className="camera-controls">
//                         <button 
//                             onClick={captureImage} 
//                             className="btn btn-success"
//                             disabled={captureCount >= 20}
//                         >
//                             Capture Image ({captureCount}/20)
//                         </button>
//                         <button 
//                             onClick={() => setIsCameraActive(false)} 
//                             className="btn btn-warning"
//                         >
//                             Stop Camera
//                         </button>
//                         <button 
//                             onClick={trainModel} 
//                             className="btn btn-primary"
//                             disabled={captureCount < 20}
//                         >
//                             Train Model
//                         </button>
//                     </div>
//                 </div>
//             )}
            
//             {registrationStatus && (
//                 <div className={`status-message ${registrationStatus.includes("success") ? 'success' : 'error'}`}>
//                     {registrationStatus}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Register;







import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';


const Register = () => {
    const [name, setName] = useState('');
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState('');
    const [captureCount, setCaptureCount] = useState(0);
    const [trainingMessage, setTrainingMessage] = useState('');
    const webcamRef = useRef(null);
    const trainingCheckRef = useRef(null);

    const startRegistration = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/start-registration', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name })
            });
            
            const data = await response.json();
            if (!data.success) throw new Error(data.error || 'Registration failed');
            
            setIsCameraActive(true);
            setRegistrationStatus('Camera active - capture 20 images');
        } catch (error) {
            setRegistrationStatus(error.message);
        }
    };

    const captureImage = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        
        try {
            const blob = await fetch(imageSrc).then(res => res.blob());
            const formData = new FormData();
            formData.append('name', name);
            formData.append('image', blob, 'capture.jpg');

            const response = await fetch('http://localhost:5000/api/capture-image', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            if (!data.success) throw new Error('Capture failed');
            
            setCaptureCount(data.count);
            setRegistrationStatus(`Captured ${data.count}/20 images`);
            
            if (data.count >= 20) {
                setRegistrationStatus('Ready to train model');
            }
        } catch (error) {
            setRegistrationStatus(error.message);
        }
    };

    const trainModel = async () => {
        try {
            setTrainingMessage('Training started...');
            const response = await fetch('http://localhost:5000/api/train-model', {
                method: 'POST'
            });
            
            const data = await response.json();
            if (!data.success) throw new Error('Training failed');
            
            // Start polling training status
            trainingCheckRef.current = setInterval(async () => {
                const statusRes = await fetch('http://localhost:5000/api/training-status');
                const statusData = await statusRes.json();
                setTrainingMessage(statusData.message);
                
                if (!statusData.is_training) {
                    clearInterval(trainingCheckRef.current);
                    if (statusData.message === 'Training completed') {
                        setRegistrationStatus('Registration complete!');
                    }
                }
            }, 1000);
            
        } catch (error) {
            setTrainingMessage(error.message);
        }
    };

    useEffect(() => {
        return () => {
            if (trainingCheckRef.current) {
                clearInterval(trainingCheckRef.current);
            }
        };
    }, []);

    return (
        <div className="registration-container">
            <h2>Student Registration</h2>
            
            {!isCameraActive ? (
                <div className="name-input">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                    />
                    <button onClick={startRegistration}>
                        Start Registration
                    </button>
                </div>
            ) : (
                <div className="camera-section">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="webcam-preview"
                    />
                    
                    <div className="capture-controls">
                        <button 
                            onClick={captureImage}
                            disabled={captureCount >= 20}
                        >
                            {captureCount >= 20 ? '20/20 Captured' : 'Capture Image'}
                        </button>
                        
                        {captureCount >= 20 && (
                            <button onClick={trainModel}>
                                Train Model
                            </button>
                        )}
                    </div>
                </div>
            )}
            
            <div className="status-messages">
                <p>{registrationStatus}</p>
                {trainingMessage && <p className="training-status">{trainingMessage}</p>}
            </div>
        </div>
    );
};

export default Register;
