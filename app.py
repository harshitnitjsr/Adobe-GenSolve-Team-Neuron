from flask import Flask, Response , jsonify
import cv2
from ultralytics import YOLO
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime
import random

model = YOLO('yolov8n.pt')


# Use your service account key file
cred = credentials.Certificate("adobe-gensolve-26-firebase-adminsdk-ve2aq-66c3f5c389.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://adobe-gensolve-26-default-rtdb.asia-southeast1.firebasedatabase.app/'
})

# # Write data to Firebase Realtime Database
ref = db.reference('liveMatch')
ref.set({
        "finalScore": [21, 18],
        "scoreArray": [
            {"player": "Player 1", "score": 15, "distance": 7.5, "speed": 65},
            {"player": "Player 2", "score": 12, "distance": 8.2, "speed": 62}
        ],
        "liveScore": {"Player 1": 10, "Player 2": 7}
        # "lastUpdated": datetime.utcnow().isoformat() + "Z"
    })

app = Flask(__name__)
CORS(app)

def generate_frames():
    cap = cv2.VideoCapture(0)
    cap.set(3, 640)
    cap.set(4, 480)

    while True:
        success, frame = cap.read()
        if not success:
            break

        results = model.predict(frame)
        for result in results:
            boxes = result.boxes.cpu().numpy()
            print(boxes)
            for box in boxes:
                (x, y, w ,h) = box.xyxy[0]
                classname=str(box.cls[0])
                
                x = int(x)
                y = int(y)
                w = int(w)
                h=int(h)
                print("Check1: ", x)
                print(x,y,w,h)
                cv2.putText(frame,classname,(x,y),1,1,(255,0,0),2)
                cv2.rectangle(frame,(w,h), (x,y),  (255,255,0),2)

        # Encode frame as JPEG
        # cv2.rectangle(frame, (100,100), (20,21), (255,255,0),2)
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
            
        shot_data = {
            "player": random.choice(["Player 1", "Player 2"]),
            "score": random.randint(0, 21),
            "distance": round(random.uniform(5.0, 10.0), 2),
            "speed": random.randint(50, 70)
        }
        ref = db.reference('liveMatch')
        match_data = ref.get()

        match_data['scoreArray'].append(shot_data)
    

        # Update the liveScore based on the new shot
        match_data['liveScore'][shot_data['player']] += 1

        # Update the lastUpdated timestamp
        # match_data['lastUpdated'] = datetime.utcnow().isoformat() + "Z"
        # print(match_data)
        ref.set(match_data)
        
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


    cap.release() 
  
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
