# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import subprocess
# import os
# import sys
# from datetime import datetime
# import csv
# import pandas as pd

# app = Flask(__name__)
# CORS(app)

# camera_process = None

# def initialize_attendance():
#     today = datetime.now().strftime('%Y-%m-%d')
#     registered_file = os.path.join('data', 'registered_students.csv')
#     attendance_file = os.path.join('data', 'attendance.csv')
    
#     if os.path.exists(attendance_file):
#         df = pd.read_csv(attendance_file, dtype=str)  # Use dtype here for reading
#         df = df[df['date'] != today]
#     else:
#         df = pd.DataFrame(columns=['name', 'date', 'time', 'status'])
    
#     registered_df = pd.read_csv(registered_file)
#     new_entries = pd.DataFrame({
#         'name': registered_df['name'],
#         'date': today,
#         'time': '',
#         'status': 'Absent'
#     })
    
#     # Correct way - no dtype parameter in to_csv()
#     pd.concat([df, new_entries]).to_csv(attendance_file, index=False)



# @app.route('/api/start-session', methods=['POST'])
# def start_session():
#     try:
#         session_start = datetime.now()  # Use current local time as session start time
#         today = session_start.strftime('%Y-%m-%d')

#         initialize_attendance()

#         session_file = os.path.join('data', 'sessions.csv')
#         with open(session_file, 'a') as f:
#             writer = csv.writer(f)
#             if os.stat(session_file).st_size == 0:
#                 writer.writerow(['session_start', 'session_end', 'date', 'duration', 'status'])
#             writer.writerow([
#                 session_start.isoformat(),
#                 '',
#                 today,
#                 100,
#                 'active'
#             ])
        
#         return jsonify({"success": True, "startTime": session_start.isoformat()})
    
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)})

# @app.route('/api/start-camera', methods=['POST'])
# def start_camera():
#     global camera_process
#     try:
#         if camera_process and camera_process.poll() is None:
#             return jsonify({"success": False, "error": "Camera already running"})

#         session_file = os.path.join('data', 'sessions.csv')
#         with open(session_file, 'r') as f:
#             reader = csv.DictReader(f)
#             session_start = datetime.fromisoformat(list(reader)[-1]['session_start'])

#         script_path = os.path.abspath(os.path.join('ml_model', 'attendance_system.py'))
#         cmd = [sys.executable, script_path, '--session-start', session_start.isoformat()]
#         camera_process = subprocess.Popen(cmd)
        
#         return jsonify({"success": True})
    
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)})

# @app.route('/api/stop-camera', methods=['POST'])
# def stop_camera():
#     global camera_process
#     if camera_process and camera_process.poll() is None:
#         camera_process.terminate()
#         camera_process = None
#         return jsonify({"success": True})
#     return jsonify({"success": False, "error": "No camera running"})

# @app.route('/api/end-session', methods=['POST'])
# def end_session():
#     global camera_process
#     try:
#         if camera_process and camera_process.poll() is None:
#             camera_process.terminate()
#             camera_process = None

#         session_file = os.path.join('data', 'sessions.csv')
        
#         if os.path.exists(session_file):
#             sessions = []
#             with open(session_file, 'r') as f:
#                 reader = csv.DictReader(f)
#                 sessions = list(reader)
            
#             if sessions:
#                 sessions[-1]['session_end'] = datetime.now().isoformat()
#                 sessions[-1]['status'] = 'ended'
                
#                 with open(session_file, 'w') as f:
#                     writer = csv.writer(f)
#                     writer.writerow(['session_start', 'session_end', 'date', 'duration', 'status'])
#                     for session in sessions:
#                         writer.writerow([
#                             session['session_start'],
#                             session['session_end'],
#                             session['date'],
#                             session['duration'],
#                             session['status']
#                         ])
        
#         return jsonify({"success": True, "message": "Session ended completely"})
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)})

# @app.route('/api/get-attendance', methods=['GET'])
# def get_attendance():
#     try:
#         registered_file = os.path.join('data', 'registered_students.csv')
#         attendance_file = os.path.join('data', 'attendance.csv')
        
#         registered_df = pd.read_csv(registered_file)
        
#         if os.path.exists(attendance_file):
#             attendance_df = pd.read_csv(attendance_file)
#             merged_df = pd.merge(registered_df, attendance_df, on='name', how='left')
#             merged_df.fillna({'time': '', 'status': 'Absent'}, inplace=True)
#             return jsonify({"success": True, "data": merged_df.to_dict(orient='records')})
        
#         return jsonify({"success": True, "data": []})
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)})

# @app.route('/api/check-session', methods=['GET'])
# def check_session():
#     try:
#         session_file = os.path.join('data', 'sessions.csv')
#         if os.path.exists(session_file):
#             with open(session_file, 'r') as f:
#                 reader = csv.DictReader(f)
#                 sessions = list(reader)
#                 if sessions and sessions[-1]['status'] == 'active':
#                     return jsonify({"hasSession": True, "startTime": sessions[-1]['session_start']})
#         return jsonify({"hasSession": False})
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)





















# from flask import Flask, jsonify, request, send_file
# from flask_cors import CORS
# import subprocess
# import os
# import sys
# from datetime import datetime
# import csv
# import pandas as pd
# from werkzeug.utils import secure_filename
# import threading
# import time

# app = Flask(__name__)
# CORS(app)

# # Shared training status
# training_status = {"is_training": False, "progress": 0, "message": ""}

# def initialize_directories():
#     os.makedirs(os.path.join('data', 'images'), exist_ok=True)
#     if not os.path.exists(os.path.join('data', 'registered_students.csv')):
#         with open(os.path.join('data', 'registered_students.csv'), 'w') as f:
#             writer = csv.writer(f)
#             writer.writerow(['name', 'student_id'])


# # Initialize attendance for the current day
# def initialize_attendance():
#     today = datetime.now().strftime('%Y-%m-%d')
#     registered_file = os.path.join('data', 'registered_students.csv')
#     attendance_file = os.path.join('data', 'attendance.csv')

#     # Load existing attendance file or create a new one
#     if os.path.exists(attendance_file):
#         df = pd.read_csv(attendance_file, dtype=str)
#         df = df[df['date'] != today]  # Remove entries for today if they exist
#     else:
#         df = pd.DataFrame(columns=['name', 'date', 'time', 'status'])

#     # Add all registered students as "Absent" for today
#     registered_df = pd.read_csv(registered_file)
#     new_entries = pd.DataFrame({
#         'name': registered_df['name'],
#         'date': today,
#         'time': '',
#         'status': 'Absent'
#     })
#     updated_df = pd.concat([df, new_entries])
#     updated_df.to_csv(attendance_file, index=False)



# initialize_directories()

# @app.route('/api/start-registration', methods=['POST'])
# def start_registration():
#     data = request.json
#     raw_name = data.get('name', '').strip()
#     name = secure_filename(raw_name.replace(' ', '_'))
    
#     if not name.replace('_', '').isalnum():
#         return jsonify(success=False, error="Invalid name format")
    
#     images_dir = os.path.join('data', 'images')
#     folder = os.path.join(images_dir, name)
#     registered_file = os.path.join('data', 'registered_students.csv')

#     try:
#         with open(registered_file, 'r+') as f:
#             reader = csv.DictReader(f)
#             existing = {row['name'] for row in reader}
            
#             if raw_name in existing:
#                 return jsonify(success=False, error="Name already registered")

#             f.seek(0, os.SEEK_END)
#             last_id = max((int(row['student_id']) for row in csv.DictReader(open(registered_file))), default=0)
#             new_id = last_id + 1
            
#             writer = csv.writer(f)
#             writer.writerow([raw_name, new_id])
        
#         os.makedirs(folder, exist_ok=True)
#         return jsonify(success=True)
    
#     except Exception as e:
#         return jsonify(success=False, error=str(e))

# @app.route('/api/capture-image', methods=['POST'])
# def capture_image():
#     name = secure_filename(request.form.get('name', '').replace(' ', '_'))
#     image = request.files.get('image')
    
#     if not name or not image:
#         return jsonify(success=False, error="Missing parameters")
    
#     if not image.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
#         return jsonify(success=False, error="Invalid file type")

#     try:
#         images_dir = os.path.join('data', 'images', name)
#         os.makedirs(images_dir, exist_ok=True)
        
#         existing_images = len([f for f in os.listdir(images_dir) if f.endswith(('.jpg', '.jpeg', '.png'))])
#         filename = f"{name}_{existing_images + 1}.jpg"
#         image.save(os.path.join(images_dir, filename))
        
#         return jsonify(success=True, count=existing_images + 1)
    
#     except Exception as e:
#         return jsonify(success=False, error=str(e))

# def train_model_async():
#     global training_status
#     try:
#         training_status.update({"is_training": True, "progress": 0, "message": "Starting training"})
        
#         # Run training scripts
#         training_status["message"] = "Encoding faces..."
#         subprocess.run([sys.executable, 'ml_model/encoding_faces.py'], check=True)
        
#         training_status["progress"] = 50
#         training_status["message"] = "Training model..."
#         subprocess.run([sys.executable, 'ml_model/train_model.py'], check=True)
        
#         training_status.update({"progress": 100, "message": "Training completed"})
#         time.sleep(2)
    
#     except Exception as e:
#         training_status["message"] = f"Training failed: {str(e)}"
    
#     finally:
#         training_status["is_training"] = False

# @app.route('/api/train-model', methods=['POST'])
# def train_model():
#     if training_status["is_training"]:
#         return jsonify(success=False, error="Training already in progress")
    
#     threading.Thread(target=train_model_async).start()
#     return jsonify(success=True, message="Training started")

# @app.route('/api/training-status', methods=['GET'])
# def get_training_status():
#     return jsonify(training_status)

# # Existing session management endpoints from original app.py



# @app.route('/api/start-session', methods=['POST'])
# def start_session():
#     try:
#         session_start = datetime.now()  # Use current local time as session start time
#         today = session_start.strftime('%Y-%m-%d')

#         initialize_attendance()

#         session_file = os.path.join('data', 'sessions.csv')
#         with open(session_file, 'a') as f:
#             writer = csv.writer(f)
#             if os.stat(session_file).st_size == 0:
#                 writer.writerow(['session_start', 'session_end', 'date', 'duration', 'status'])
#             writer.writerow([
#                 session_start.isoformat(),
#                 '',
#                 today,
#                 100,
#                 'active'
#             ])
        
#         return jsonify({"success": True, "startTime": session_start.isoformat()})
    
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)})

# @app.route('/api/start-camera', methods=['POST'])
# def start_camera():
#     global camera_process
#     try:
#         if camera_process and camera_process.poll() is None:
#             return jsonify({"success": False, "error": "Camera already running"})

#         session_file = os.path.join('data', 'sessions.csv')
#         with open(session_file, 'r') as f:
#             reader = csv.DictReader(f)
#             session_start = datetime.fromisoformat(list(reader)[-1]['session_start'])

#         script_path = os.path.abspath(os.path.join('ml_model', 'attendance_system.py'))
#         cmd = [sys.executable, script_path, '--session-start', session_start.isoformat()]
#         camera_process = subprocess.Popen(cmd)
        
#         return jsonify({"success": True})
    
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)})

# @app.route('/api/stop-camera', methods=['POST'])
# def stop_camera():
#     global camera_process
#     if camera_process and camera_process.poll() is None:
#         camera_process.terminate()
#         camera_process = None
#         return jsonify({"success": True})
#     return jsonify({"success": False, "error": "No camera running"})

# @app.route('/api/end-session', methods=['POST'])
# def end_session():
#     global camera_process
#     try:
#         if camera_process and camera_process.poll() is None:
#             camera_process.terminate()
#             camera_process = None

#         session_file = os.path.join('data', 'sessions.csv')
        
#         if os.path.exists(session_file):
#             sessions = []
#             with open(session_file, 'r') as f:
#                 reader = csv.DictReader(f)
#                 sessions = list(reader)
            
#             if sessions:
#                 sessions[-1]['session_end'] = datetime.now().isoformat()
#                 sessions[-1]['status'] = 'ended'
                
#                 with open(session_file, 'w') as f:
#                     writer = csv.writer(f)
#                     writer.writerow(['session_start', 'session_end', 'date', 'duration', 'status'])
#                     for session in sessions:
#                         writer.writerow([
#                             session['session_start'],
#                             session['session_end'],
#                             session['date'],
#                             session['duration'],
#                             session['status']
#                         ])
        
#         return jsonify({"success": True, "message": "Session ended completely"})
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)})

# @app.route('/api/get-attendance', methods=['GET'])
# def get_attendance():
#     try:
#         registered_file = os.path.join('data', 'registered_students.csv')
#         attendance_file = os.path.join('data', 'attendance.csv')
        
#         registered_df = pd.read_csv(registered_file)
        
#         if os.path.exists(attendance_file):
#             attendance_df = pd.read_csv(attendance_file)
#             merged_df = pd.merge(registered_df, attendance_df, on='name', how='left')
#             merged_df.fillna({'time': '', 'status': 'Absent'}, inplace=True)
#             return jsonify({"success": True, "data": merged_df.to_dict(orient='records')})
        
#         return jsonify({"success": True, "data": []})
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)})

# @app.route('/api/check-session', methods=['GET'])
# def check_session():
#     try:
#         session_file = os.path.join('data', 'sessions.csv')
#         if os.path.exists(session_file):
#             with open(session_file, 'r') as f:
#                 reader = csv.DictReader(f)
#                 sessions = list(reader)
#                 if sessions and sessions[-1]['status'] == 'active':
#                     return jsonify({"hasSession": True, "startTime": sessions[-1]['session_start']})
#         return jsonify({"hasSession": False})
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)







from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import subprocess
import os
import sys
from datetime import datetime
import csv
import pandas as pd
from werkzeug.utils import secure_filename
import threading
import time

app = Flask(__name__)
CORS(app)

# Shared global variables
camera_process = None
training_status = {"is_training": False, "progress": 0, "message": ""}

def initialize_directories():
    """Initialize required directories and files"""
    os.makedirs(os.path.join('data', 'images'), exist_ok=True)
    if not os.path.exists(os.path.join('data', 'registered_students.csv')):
        with open(os.path.join('data', 'registered_students.csv'), 'w') as f:
            writer = csv.writer(f)
            writer.writerow(['name', 'student_id'])

def initialize_attendance():
    """Initialize attendance records for new session"""
    today = datetime.now().strftime('%Y-%m-%d')
    registered_file = os.path.join('data', 'registered_students.csv')
    attendance_file = os.path.join('data', 'attendance.csv')

    if os.path.exists(attendance_file):
        df = pd.read_csv(attendance_file, dtype=str)
        df = df[df['date'] != today]
    else:
        df = pd.DataFrame(columns=['name', 'date', 'time', 'status'])

    registered_df = pd.read_csv(registered_file)
    new_entries = pd.DataFrame({
        'name': registered_df['name'],
        'date': today,
        'time': '',
        'status': 'Absent'
    })
    pd.concat([df, new_entries]).to_csv(attendance_file, index=False)

# Initialize directories at startup
initialize_directories()

# ================= Dashboard Endpoints =================
@app.route('/api/start-session', methods=['POST'])
def start_session():
    try:
        session_start = datetime.now()
        today = session_start.strftime('%Y-%m-%d')
        
        initialize_attendance()

        session_file = os.path.join('data', 'sessions.csv')
        with open(session_file, 'a') as f:
            writer = csv.writer(f)
            if os.stat(session_file).st_size == 0:
                writer.writerow(['session_start', 'session_end', 'date', 'duration', 'status'])
            writer.writerow([
                session_start.isoformat(),
                '',
                today,
                100,
                'active'
            ])
        
        return jsonify({"success": True, "startTime": session_start.isoformat()})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/start-camera', methods=['POST'])
def start_camera():
    global camera_process
    try:
        if camera_process and camera_process.poll() is None:
            return jsonify({"success": False, "error": "Camera already running"})

        session_file = os.path.join('data', 'sessions.csv')
        with open(session_file, 'r') as f:
            reader = csv.DictReader(f)
            session_start = datetime.fromisoformat(list(reader)[-1]['session_start'])

        script_path = os.path.abspath(os.path.join('ml_model', 'attendance_system.py'))
        cmd = [sys.executable, script_path, '--session-start', session_start.isoformat()]
        camera_process = subprocess.Popen(cmd)
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/stop-camera', methods=['POST'])
def stop_camera():
    global camera_process
    if camera_process and camera_process.poll() is None:
        camera_process.terminate()
        camera_process = None
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "No camera running"})

@app.route('/api/end-session', methods=['POST'])
def end_session():
    global camera_process
    try:
        if camera_process and camera_process.poll() is None:
            camera_process.terminate()
            camera_process = None

        session_file = os.path.join('data', 'sessions.csv')
        if os.path.exists(session_file):
            sessions = []
            with open(session_file, 'r') as f:
                reader = csv.DictReader(f)
                sessions = list(reader)
            
            if sessions:
                sessions[-1]['session_end'] = datetime.now().isoformat()
                sessions[-1]['status'] = 'ended'
                
                with open(session_file, 'w') as f:
                    writer = csv.writer(f)
                    writer.writerow(['session_start', 'session_end', 'date', 'duration', 'status'])
                    for session in sessions:
                        writer.writerow([
                            session['session_start'],
                            session['session_end'],
                            session['date'],
                            session['duration'],
                            session['status']
                        ])
        
        return jsonify({"success": True, "message": "Session ended completely"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/get-attendance', methods=['GET'])
def get_attendance():
    try:
        registered_file = os.path.join('data', 'registered_students.csv')
        attendance_file = os.path.join('data', 'attendance.csv')
        
        registered_df = pd.read_csv(registered_file)
        if os.path.exists(attendance_file):
            attendance_df = pd.read_csv(attendance_file)
            merged_df = pd.merge(registered_df, attendance_df, on='name', how='left')
            merged_df.fillna({'time': '', 'status': 'Absent'}, inplace=True)
            return jsonify({"success": True, "data": merged_df.to_dict(orient='records')})
        
        return jsonify({"success": True, "data": []})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/check-session', methods=['GET'])
def check_session():
    try:
        session_file = os.path.join('data', 'sessions.csv')
        if os.path.exists(session_file):
            with open(session_file, 'r') as f:
                reader = csv.DictReader(f)
                sessions = list(reader)
                if sessions and sessions[-1]['status'] == 'active':
                    return jsonify({"hasSession": True, "startTime": sessions[-1]['session_start']})
        return jsonify({"hasSession": False})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

# ================= Registration Endpoints =================
@app.route('/api/start-registration', methods=['POST'])
def start_registration():
    data = request.json
    raw_name = data.get('name', '').strip()
    name = secure_filename(raw_name.replace(' ', '_'))
    
    if not name.replace('_', '').isalnum():
        return jsonify(success=False, error="Invalid name format")
    
    images_dir = os.path.join('data', 'images')
    folder = os.path.join(images_dir, name)
    registered_file = os.path.join('data', 'registered_students.csv')

    try:
        with open(registered_file, 'r+') as f:
            reader = csv.DictReader(f)
            existing = {row['name'] for row in reader}
            
            if raw_name in existing:
                return jsonify(success=False, error="Name already registered")

            f.seek(0, os.SEEK_END)
            last_id = max((int(row['student_id']) for row in csv.DictReader(open(registered_file))), default=0)
            new_id = last_id + 1
            
            writer = csv.writer(f)
            writer.writerow([raw_name, new_id])
        
        os.makedirs(folder, exist_ok=True)
        return jsonify(success=True)
    except Exception as e:
        return jsonify(success=False, error=str(e))

@app.route('/api/capture-image', methods=['POST'])
def capture_image():
    name = secure_filename(request.form.get('name', '').replace(' ', '_'))
    image = request.files.get('image')
    
    if not name or not image:
        return jsonify(success=False, error="Missing parameters")
    
    if not image.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        return jsonify(success=False, error="Invalid file type")

    try:
        images_dir = os.path.join('data', 'images', name)
        os.makedirs(images_dir, exist_ok=True)
        
        existing_images = len([f for f in os.listdir(images_dir) if f.endswith(('.jpg', '.jpeg', '.png'))])
        filename = f"{name}_{existing_images + 1}.jpg"
        image.save(os.path.join(images_dir, filename))
        
        return jsonify(success=True, count=existing_images + 1)
    except Exception as e:
        return jsonify(success=False, error=str(e))

def train_model_async():
    global training_status
    try:
        training_status.update({"is_training": True, "progress": 0, "message": "Starting training"})
        
        # Run encoding script
        training_status["message"] = "Encoding faces..."
        subprocess.run([sys.executable, 'ml_model/encoding_faces.py'], check=True)
        
        # Run training script
        training_status["progress"] = 50
        training_status["message"] = "Training model..."
        subprocess.run([sys.executable, 'ml_model/train_model.py'], check=True)

        training_status.update({"progress": 100, "message": "Training completed"})
        time.sleep(2)
    except Exception as e:
        training_status["message"] = f"Training failed: {str(e)}"
    finally:
        training_status["is_training"] = False

@app.route('/api/train-model', methods=['POST'])
def train_model():
    if training_status["is_training"]:
        return jsonify(success=False, error="Training already in progress")
    
    threading.Thread(target=train_model_async).start()
    return jsonify(success=True, message="Training started")

@app.route('/api/training-status', methods=['GET'])
def get_training_status():
    return jsonify(training_status)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
