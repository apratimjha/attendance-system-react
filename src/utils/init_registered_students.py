# utils/init_registered_students.py
import pandas as pd
import os

registered_file = 'data/registered_students.csv'
if not os.path.exists(registered_file):
    df = pd.DataFrame({
        'name': ['Basel Ali Khan', 'Sujal Khera', 'Apratim Jha', 'Arnav Gupta', 
                 'Shivansh Dixit', 'Afnaan Kaif', 'Kartik Ahlawat'],
        'student_id': [1, 2, 3, 4, 5, 6, 7]
    })
    df.to_csv(registered_file, index=False)
