import os
import face_recognition
import cv2
import numpy as np
import pickle

# Get base directory
base_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(base_dir)
image_dir = os.path.join(project_dir, "data", "images")
encodings_file = os.path.join(project_dir, "data", "encodings.pickle")

# Load existing encodings if available
known_encodings = []
known_names = []

if os.path.exists(encodings_file) and os.path.getsize(encodings_file) > 0:
    try:
        with open(encodings_file, "rb") as f:
            data = pickle.load(f)
            known_encodings = data["encodings"]
            known_names = data["names"]
            print("Loaded existing encodings.")
    except (EOFError, pickle.UnpicklingError):
        print("Error loading encodings file. Starting fresh.")
else:
    print("No existing encodings found or file is empty. Starting fresh.")

# Get unique names already processed
processed_names = set(known_names)
print(f"Already processed people: {processed_names}")

# Process images
processed_count = 0
print(f"Looking for images in: {image_dir}")

for name in os.listdir(image_dir):
    person_dir = os.path.join(image_dir, name)
    if not os.path.isdir(person_dir):
        continue

    # Skip if this person is already processed
    if name in processed_names:
        print(f"Skipping already processed person: {name}")
        continue

    print(f"Processing images for: {name}")
    person_processed = False

    for image_name in os.listdir(person_dir):
        img_path = os.path.join(person_dir, image_name)
        
        # Skip if this person is already processed in this run
        if person_processed:
            continue

        print(f"Processing image: {img_path}")
        img = cv2.imread(img_path)
        if img is None:
            print(f"Skipping invalid image file: {img_path}")
            continue

        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_img)
        
        if not face_locations:
            print(f"No face detected in {img_path}")
            continue

        print(f"Found {len(face_locations)} face(s) in {img_path}")
        encodings = face_recognition.face_encodings(rgb_img, face_locations)
        
        if encodings:
            for encoding in encodings:
                known_encodings.append(encoding)
                known_names.append(name)
                processed_count += 1
                person_processed = True
                print(f"Successfully encoded face for {name}")

# Save updated encodings
if processed_count > 0:
    data = {"encodings": known_encodings, "names": known_names}
    with open(encodings_file, "wb") as f:
        pickle.dump(data, f)
    print(f"Encodings updated and saved in {encodings_file}!")
    print(f"Total faces encoded: {len(known_encodings)}")
    print(f"Total unique people: {len(set(known_names))}")
else:
    print("No new faces were encoded. Encodings file not updated.")
