from flask import Flask, Response, jsonify
from ultralytics import YOLO
from flask_cors import CORS
import random
from main import main

app = Flask(__name__)
CORS(app)

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

    # Process the frame with YOLO model (assuming some model processing here)
    # Simulating match data update based on detection results
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
    for frames in main():
        actual_frame_bytes, frame_bytes, play_area_with_players_bytes = frames
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + actual_frame_bytes + b'\r\n')

def generate_actual_frames():
    for frames in main():
        actual_frame_bytes, frame_bytes, play_area_with_players_bytes = frames
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + actual_frame_bytes + b'\r\n')

def generate_map_frames():
    for frames in main():
        actual_frame_bytes, frame_bytes, play_area_with_players_bytes = frames
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + play_area_with_players_bytes + b'\r\n')


@app.route('/get_match_data', methods=['GET'])
def get_match_data():
    return jsonify(match_data)

@app.route('/match_map_feed')
def match_map_feed():
    return Response(generate_map_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/yolo_video_feed')
def yolo_video_feed():
    return Response(generate_yolo_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/actual_video_feed')
def actual_video_feed():
    return Response(generate_actual_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
