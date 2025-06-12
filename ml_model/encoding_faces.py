import os
import pickle
import cv2
import face_recognition

# Define paths
base_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(base_dir)
IMAGE_DIR = os.path.join(project_dir, "data", "images")
ENCODINGS_FILE = os.path.join(project_dir, "data", "encodings.pickle")

# Initialize lists for encodings and names
known_encodings = []
known_names = []

# Loop through each image in the dataset
for person_name in os.listdir(IMAGE_DIR):
    person_folder = os.path.join(IMAGE_DIR, person_name)
    if not os.path.isdir(person_folder):
        continue  # Skip if it's not a folder

    for image_name in os.listdir(person_folder):
        image_path = os.path.join(person_folder, image_name)
        print(f"Processing {image_path}")

        # Load image and convert to RGB
        image = cv2.imread(image_path)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Detect face locations
        face_locations = face_recognition.face_locations(rgb_image)
        encodings = face_recognition.face_encodings(rgb_image, face_locations)

        # Store encodings with name
        for encoding in encodings:
            known_encodings.append(encoding)
            known_names.append(person_name)

# Save encodings to file
print("Saving encodings to file...")
with open(ENCODINGS_FILE, "wb") as f:
    pickle.dump({"encodings": known_encodings, "names": known_names}, f)

print("Encoding process complete!")
