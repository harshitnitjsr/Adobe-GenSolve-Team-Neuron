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
status = ""
hitplayer = "abcd"
hit_coords = None
shuttle_curr_coords = None
hit_shuttle_coords = None
w_scaler = None
h_scaler = None
frame_no = 0
prev_hit_frame = 0
hit_count = 0
prev_hit_coords = [(),()]



distance_player = {
    "Player 1": dis_p1,
    "Player 2": dis_p2
}

def calculate_distance(prev_coords, player_coords, h_scaler, w_scaler):
    distance1,distance2 = 0,0
    global dis_p1, dis_p2, distance_player, hitplayer, hit_coords, hit_shuttle_coords,shuttle_curr_coords, frame_no, prev_hit_frame, hit_count, prev_hit_coords

    if prev_coords[0]!=() and player_coords[0]!=():
        distance1 = np.sqrt((h_scaler*(player_coords[0][0] - prev_coords[0][0]))**2 + (w_scaler*(player_coords[0][1] - prev_coords[0][1]))**2) 
    if prev_coords[1]!=() and player_coords[1]!=():
        distance2 = np.sqrt((h_scaler*(player_coords[1][0] - prev_coords[1][0]))**2 + (w_scaler*(player_coords[1][1] - prev_coords[1][1]))**2)
    dis_p1+=distance1
    dis_p2+=distance2
    distance_player["Player 1"] = round(dis_p1, 2)
    distance_player["Player 2"] = round(dis_p2, 2)

def calculate_shuttle_distance(pt1, pt2, h_scaler, w_scaler):
    print("PK: ", pt1, pt2)
    if (pt1 is None or pt2 is None or pt1==() or pt2 == ()):
        return 0
    distance = np.sqrt((h_scaler*(pt2[0] - pt1[0]))**2 + (w_scaler*(pt2[1] - pt1[1]))**2)
    return distance
    
# In-memory storage for match data
match_data = {
    "finalScore": [21, 18],
    "scoreArray": {
        "Player 1": [{"score": 0, "distance": 0, "speed": 0}],
        "Player 2": [{"score": 0, "distance": 0, "speed": 0}]
    },
    "liveScore": {"Player 1": 0, "Player 2": 0}, 
    "playerdistance":distance_player,
    "Status":"",
    "HitPlayer":hitplayer
}

# def tracking_shuttle_cock():
#     for frames in main():
#         actual_frame_bytes, frame_bytes, play_area_with_players_bytes = frames
#         yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + actual_frame_bytes + b'\r\n')

def update_match_data_from_frame(act_hit_count):
    global match_data, status, dis_p1, dis_p2, distance_player, hitplayer, hit_coords, hit_shuttle_coords,shuttle_curr_coords, h_scaler, w_scaler, frame_no, prev_hit_frame, hit_count,prev_hit_coords

    # Process the frame with YOLO model (assuming some model processing here)
    # Simulating match data update based on detection results

    if (status is None):
        match_data["Status"]=""
    else:
        match_data["Status"] = status
    # print(match_data)

    match_data["HitPlayer"] = hitplayer
    print("Status", status)
    print("HitPlayer", hitplayer)
    if (status=="Hit" and (act_hit_count>hit_count) and (hitplayer !=  'abcd'  or hitplayer is not None)):
        hit_count+=1
        print("Hit", hit_count)
        print("PK1:", prev_hit_coords)
        match_data["scoreArray"][hitplayer].append(
            {"score": match_data["scoreArray"][hitplayer][-1]["score"],
            "distance":calculate_shuttle_distance(prev_hit_coords[int(hitplayer[-1])-1],shuttle_curr_coords, h_scaler, w_scaler),
            "speed": match_data["scoreArray"][hitplayer][-1]["distance"] / (frame_no - prev_hit_frame)*30}
            )
    elif (status == "Miss" and hitplayer is not None):
        print("PK1:", prev_hit_coords)
        match_data["scoreArray"][hitplayer].append(
            {"score": match_data["scoreArray"][hitplayer][-1]["score"]+1,
            "distance":calculate_shuttle_distance(prev_hit_coords[int(hitplayer[-1])-1],shuttle_curr_coords, h_scaler, w_scaler),
            "speed":match_data["scoreArray"][hitplayer][-1]["distance"] / (frame_no - prev_hit_frame)*30}
            )


def get_player_data():
    global h_scaler, w_scaler
    for frames in main():
        v1,v2,play_area, player_coords = frames
        h,w = play_area.shape[:2]
        h_scaler, w_scaler = 13.4/h, 5.18/w
        dis = calculate_distance(prev_coords,player_coords, h_scaler, w_scaler)
        prev_coords = player_coords
        # print(dis)
        yield(dis)

def generate_yolo_frames():
    global prev_coords, status, h_scaler, w_scaler, frame_no, prev_hit_frame, hitplayer, hit_shuttle_coords, hit_coords,shuttle_curr_coords, prev_hit_coords
    for frames in main():
        actual_frame_bytes, frame_bytes, play_area_with_players_bytes, player_coords, status,hitplayer, hit_shuttle_coords, hit_coords,prev_hit_frame, frame_no, shuttle_curr_coords, act_hit_count,prev_hit_coords = frames
        # print("Check1")
        update_match_data_from_frame(act_hit_count)
        h,w = 720,544
        h_scaler, w_scaler = 13.4/h, 5.18/w
        calculate_distance(prev_coords,player_coords, h_scaler, w_scaler)
        prev_coords = player_coords
        print(match_data)
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

def generate_actual_frames():
    global prev_coords, status, h_scaler, w_scaler,  frame_no, prev_hit_frame, hitplayer, hit_shuttle_coords, hit_coords,shuttle_curr_coords, prev_hit_coords
    for frames in main():
        actual_frame_bytes, frame_bytes, play_area_with_players_bytes, player_coords, status, hitplayer, hit_shuttle_coords,hit_coords,prev_hit_frame, frame_no, shuttle_curr_coords,act_hit_count,prev_hit_coords = frames
        h,w = 720,544
        update_match_data_from_frame(act_hit_count)
        print(match_data)
        h_scaler, w_scaler = 13.4/h, 5.18/w
        calculate_distance(prev_coords,player_coords, h_scaler, w_scaler)
        prev_coords = player_coords
        yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + actual_frame_bytes + b'\r\n')

def generate_map_frames():
    for frames in main():
        actual_frame_bytes, frame_bytes, play_area_with_players_bytes, player_coords, status,hitplayer, hit_shuttle_coords,hit_coords,prev_hit_frame, frame_no, shuttle_curr_coords,act_hit_count,prev_hit_coords = frames
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
