import face_recognition
import cv2
import os
import numpy as np
import pickle

# Get base directory
base_dir = os.path.dirname(os.path.abspath(__file__))
data_dir = os.path.join(os.path.dirname(base_dir), "data")
encodings_file = os.path.join(data_dir, "encodings.pickle")

# Load known encodings if available
def load_encodings():
    if os.path.exists(encodings_file):
        with open(encodings_file, "rb") as f:
            try:
                data = pickle.load(f)
                return data["encodings"], data["names"]
            except EOFError:
                print("Error: Encodings file is empty or corrupted. Returning empty lists.")
                return [], []
    else:
        return [], []

def recognize_faces(image_path):
    known_encodings, known_names = load_encodings()
    if not known_encodings:
        return []

    image = cv2.imread(image_path)
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb_image)
    encodings = face_recognition.face_encodings(rgb_image, boxes)
    names = []

    for encoding in encodings:
        distances = face_recognition.face_distance(known_encodings, encoding)
        min_distance = min(distances) if len(distances) > 0 else None
        
        # Hardcoded threshold value
        THRESHOLD = 0.4
        
        if min_distance is not None and min_distance < THRESHOLD:
            best_match_index = np.argmin(distances)
            name = known_names[best_match_index]
        else:
            name = "Unknown"
            
        names.append(name)
        
    return names
