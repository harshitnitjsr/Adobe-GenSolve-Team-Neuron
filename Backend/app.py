from flask import Flask, Response, jsonify
from ultralytics import YOLO
from flask_cors import CORS
import random
from main import main
import numpy as np
import cv2

app = Flask(__name__)
CORS(app)

prev_coords = [(),()]
dis_p1 = 0
dis_p2 = 0

distance_player = {
    "player1": dis_p1,
    "player2": dis_p2
}

def calculate_distance(prev_coords, player_coords, h_scaler, w_scaler):
    distance1,distance2 = 0,0
    global dis_p1, dis_p2, distance_player
    if prev_coords[0]!=() and player_coords[0]!=():
        distance1 = np.sqrt((h_scaler*(player_coords[0][0] - prev_coords[0][0]))**2 + (w_scaler*(player_coords[0][1] - prev_coords[0][1]))**2) 
    if prev_coords[1]!=() and player_coords[1]!=():
        distance2 = np.sqrt((h_scaler*(player_coords[1][0] - prev_coords[1][0]))**2 + (w_scaler*(player_coords[1][1] - prev_coords[1][1]))**2)
    dis_p1+=distance1
    dis_p2+=distance2
    distance_player["player1"] = round(dis_p1, 2)
    distance_player["player2"] = round(dis_p2, 2)
    
# In-memory storage for match data
match_data = {
    "finalScore": [21, 18],
    "scoreArray": [
        {"player": "Player 1", "score": 15, "distance": 7.5, "speed": 65},
        {"player": "Player 2", "score": 12, "distance": 8.2, "speed": 62}
    ],
    "liveScore": {"Player 1": 10, "Player 2": 7}
}

def tracking_shuttle_cock():
    for frames in main():
        actual_frame_bytes, frame_bytes, play_area_with_players_bytes = frames
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + actual_frame_bytes + b'\r\n')

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

def get_player_data():
    for frames in main():
        v1,v2,play_area, player_coords = frames
        h,w = play_area.shape[:2]
        h_scaler, w_scaler = 13.4/h, 5.18/w
        dis = calculate_distance(prev_coords,player_coords, h_scaler, w_scaler)
        prev_coords = player_coords
        print(dis)
        yield(dis)

def generate_yolo_frames():
    global prev_coords
    for frames in main():
        actual_frame_bytes, frame_bytes, play_area_with_players_bytes, player_coords = frames
        # print("Check1")
        h,w = 720,544
        h_scaler, w_scaler = 13.4/h, 5.18/w
        calculate_distance(prev_coords,player_coords, h_scaler, w_scaler)
        prev_coords = player_coords
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

def generate_actual_frames():
    for frames in main():
        actual_frame_bytes, frame_bytes, play_area_with_players_bytes, player_coords = frames
        h,w = 720,544
        h_scaler, w_scaler = 13.4/h, 5.18/w
        calculate_distance(prev_coords,player_coords, h_scaler, w_scaler)
        prev_coords = player_coords
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + actual_frame_bytes + b'\r\n')

def generate_map_frames():
    for frames in main():
        actual_frame_bytes, frame_bytes, play_area_with_players_bytes, player_coords = frames
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + play_area_with_players_bytes + b'\r\n')


@app.route('/get_match_data', methods=['GET'])
def get_match_data():
    return jsonify(match_data)


@app.route('/distance_covered_by_each_player', methods=['GET'])
def distance_covered_by_each_player():
    return jsonify(match_data)


@app.route('/get_player_stats', methods=['GET'])
def get_player_stats():
    return jsonify(distance_player)

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
