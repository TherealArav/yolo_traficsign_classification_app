from flask import Flask, request, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from sqlalchemy.sql import func
from flask_migrate import Migrate
from PIL import Image
import os
from ultralytics import YOLO
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

# Coneect Database
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")
database_host = os.getenv("DATABASE_HOST",'localhost')
db_url = f"postgresql://{db_user}:{db_password}@{database_host}/{db_name}"
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)



class PredictionLog(db.Model):

    id: Mapped[int] = mapped_column(primary_key =True)
    file_name: Mapped[str] = mapped_column(String(100))
    timestamp: Mapped[datetime] = mapped_column(default=func.now())
    detected_objects: Mapped[str] = mapped_column(String(200), nullable=True) 
    total_objects: Mapped[int] = mapped_column()
    file_path: Mapped[str] = mapped_column(String(200), nullable=True)


# Load the pre-trained YOLO model for road sign classification
model = YOLO('best.pt')

PREDICTION_DIR = os.path.join('static', 'predictions')
os.makedirs(PREDICTION_DIR, exist_ok=True)

@app.route('/')
def home():
    """Render the home page"""
    return render_template('index.html')

@app.route('/predict', methods= ['POST'])
def predict():
    """Classify uploaded road sign image using YOLO model"""

    if 'file' not in request.files:
        return jsonify({'error': "No file found in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': "No selected file"}), 400
    
    try:
        img = Image.open(file.stream)
        results = model.predict(source=img, conf=0.5)

        detected_class = []

        for box in results[0].boxes:
            class_id = int(box.cls[0])
            class_name = results[0].names[class_id]
            detected_class.append(class_name)
        
        unique_class = list(set(detected_class))

        if not unique_class:
            unique_class = ['No Object Detected']

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        predict_filename = f"prediction_{timestamp}.jpg"
        predict_path = os.path.join(PREDICTION_DIR, predict_filename)
        results[0].save(filename=predict_path)

        new_record = PredictionLog(
            file_name=predict_filename,
            detected_objects=', '.join(list(unique_class)),
            total_objects=len(results[0].boxes),
            file_path=f"/static/predictions/{predict_filename}"
        )

        db.session.add(new_record)
        db.session.commit()

        return jsonify({
            "success": True,
            'predict_image_url': f"/static/predictions/{predict_filename}",
            'detections': len(results[0].boxes),
            'detected_object': unique_class

        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')

