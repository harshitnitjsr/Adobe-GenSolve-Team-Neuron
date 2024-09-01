from flask import Flask, Response, jsonify
import cv2
from ultralytics import YOLO
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Initialize YOLO model
model = YOLO('yolov8n.pt')

# In-memory storage for match data
match_data = {
    "finalScore": [21, 18],
    "scoreArray": [
        {"player": "Player 1", "score": 15, "distance": 7.5, "speed": 65},
        {"player": "Player 2", "score": 12, "distance": 8.2, "speed": 62}
    ],
    "liveScore": {"Player 1": 10, "Player 2": 7}
}

def update_match_data_from_frame(frame):
    global match_data
    
    # Process the frame with YOLO model
    results = model.predict(frame)
    
    for result in results:
        boxes = result.boxes.cpu().numpy()
        for box in boxes:
            (x, y, w, h) = box.xyxy[0]
            classname = str(box.cls[0])

            # Randomly simulate some match data based on detected objects
            shot_data = {
                "player": random.choice(["Player 1", "Player 2"]),
                "score": random.randint(0, 21),
                "distance": round(random.uniform(5.0, 10.0), 2),
                "speed": random.randint(50, 70)
            }

            # Update match data
            match_data['scoreArray'].append(shot_data)
            match_data['liveScore'][shot_data['player']] += 1

def generate_yolo_frames():
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success:
            break

        # Update match data based on frame analysis
        update_match_data_from_frame(frame)

        # Annotate frame with YOLO detections
        results = model.predict(frame)
        for result in results:
            boxes = result.boxes.cpu().numpy()
            for box in boxes:
                (x, y, w, h) = box.xyxy[0]
                classname = str(box.cls[0])

                x = int(x)
                y = int(y)
                w = int(w)
                h = int(h)

                cv2.putText(frame, classname, (x, y), 1, 1, (255, 0, 0), 2)
                cv2.rectangle(frame, (w, h), (x, y), (255, 255, 0), 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    cap.release()
def generate_actual_frames():
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success:
            break

        # Update match data based on frame analysis
        update_match_data_from_frame(frame)

        # Annotate frame with YOLO detections
        results = model.predict(frame)
        for result in results:
            boxes = result.boxes.cpu().numpy()
            for box in boxes:
                (x, y, w, h) = box.xyxy[0]
                classname = str(box.cls[0])

                x = int(x)
                y = int(y)
                w = int(w)
                h = int(h)

              

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    cap.release()

@app.route('/get_match_data', methods=['GET'])
def get_match_data():
    return jsonify(match_data)

@app.route('/yolo_video_feed')
def yolo_video_feed():
    return Response(generate_yolo_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/actula-video-feed')
def actual_video_feed():
    return Response(generate_actual_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
