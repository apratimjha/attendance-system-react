import os
import csv
import cv2

# Paths
base_dir = os.path.dirname(os.path.abspath(__file__))
images_dir = os.path.join(os.path.dirname(base_dir), "data", "images")
registered_file = os.path.join(os.path.dirname(base_dir), "data", "registered_students.csv")

# Ensure images directory exists
if not os.path.exists(images_dir):
    os.makedirs(images_dir)

name = input("Enter your name: ")
folder = os.path.join(images_dir, name)

if not os.path.exists(folder):
    os.makedirs(folder)
    print(f"Directory {folder} created!")

# Add name to registered_students.csv
if os.path.exists(registered_file):
    with open(registered_file, 'r') as f:
        reader = csv.DictReader(f)
        existing_records = list(reader)
    
    # Calculate max student ID and add 1 for new entry
    if existing_records:
        max_id = max(int(row['student_id']) for row in existing_records)
        new_id = max_id + 1
    else:
        new_id = 1
    
    # Check if name already exists
    existing_names = [row['name'] for row in existing_records]
    if name not in existing_names:
        with open(registered_file, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([name, new_id])
            print(f"{name} added to registered_students.csv with ID {new_id}")
else:
    # Create file and add header and first entry
    with open(registered_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['name', 'student_id'])
        writer.writerow([name, 1])
        print(f"{name} added to registered_students.csv as first entry with ID 1")

# Open camera to capture images
cam = cv2.VideoCapture(0)
count = 0

while True:
    ret, frame = cam.read()
    if not ret:
        print("Failed to grab frame. Exiting...")
        break

    cv2.imshow("Image Capture", frame)
    key = cv2.waitKey(1)

    if key % 256 == 27:  # ESC to quit
        print("Closing...")
        break
    elif key % 256 == 32:  # SPACE to capture image
        img_name = os.path.join(folder, f"{name}_{count}.jpg")
        cv2.imwrite(img_name, frame)
        print(f"Image {img_name} saved!")
        count += 1

cam.release()
cv2.destroyAllWindows()
