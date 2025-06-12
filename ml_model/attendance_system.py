import face_recognition
import cv2
import numpy as np
import pandas as pd
import pickle
from datetime import datetime
import os
import argparse
import csv
import time

def update_attendance(name, session_start):
    now = datetime.now().replace(tzinfo=None)
    session_start = session_start.replace(tzinfo=None)
    time_diff = (now - session_start).total_seconds() / 60
    status = 'Present' if time_diff <= 20 else 'Late'
    
    attendance_file = os.path.join('data', 'attendance.csv')
    today = now.strftime('%Y-%m-%d')
    
    # Read fresh data every time
    df = pd.read_csv(
    attendance_file,
    dtype={'time': str, 'status': str},  # Explicit dtype specification
    keep_default_na=False  # Prevent NaN conversion for empty strings
    )

    
    # Update only if status is better than current
    mask = (df['name'] == name) & (df['date'] == today)
    
    if not df.loc[mask, 'status'].isin(['Present', 'Late']).any():
        df.loc[mask, ['time', 'status']] = [
            now.strftime('%I:%M %p'),
            status
        ]
        # Explicitly close the file after write
        df.to_csv(attendance_file, index=False)  # Remove mode='w'
        print(f"Updated {name} as {status}")


def run_attendance_system(session_start=None):
    try:
        # Load registered students
        registered_file = os.path.join('data', 'registered_students.csv')
        registered_df = pd.read_csv(registered_file)
        all_students = registered_df['name'].tolist()

        # Load face encodings
        encodings_file = os.path.join('data', 'encodings.pickle')
        with open(encodings_file, 'rb') as f:
            data = pickle.load(f)

        # Get session start time
        session_file = os.path.join('data', 'sessions.csv')
        with open(session_file, 'r') as f:
            reader = csv.DictReader(f)
            session_start = datetime.fromisoformat(list(reader)[-1]['session_start'])

        # Camera setup
        cam = cv2.VideoCapture(0)
        cam.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        while True:
            ret, frame = cam.read()
            if not ret:
                continue

            # Face recognition
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face_locations = face_recognition.face_locations(rgb_frame, model="hog")
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

            for encoding in face_encodings:
                matches = face_recognition.compare_faces(data["encodings"], encoding, tolerance=0.45)
                face_distances = face_recognition.face_distance(data["encodings"], encoding)
                
                if True in matches:
                    best_match_index = np.argmin(face_distances)
                    if face_distances[best_match_index] < 0.5:
                        name = data["names"][best_match_index]
                        update_attendance(name, session_start)

            # Display session info
            elapsed = (datetime.now() - session_start).total_seconds() / 60
            status = "Present" if elapsed <= 20 else "Late"
            cv2.putText(frame, f"Session: {int(elapsed)}min ({status})", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            
            cv2.imshow("Attendance System", frame)
            if cv2.waitKey(1) & 0xFF == 27:
                break

        cam.release()
        cv2.destroyAllWindows()

    except Exception as e:
        print(f"Error: {str(e)}")
        if 'cam' in locals():
            cam.release()
            cv2.destroyAllWindows()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--session-start', type=str)
    args = parser.parse_args()
    run_attendance_system(args.session_start)
