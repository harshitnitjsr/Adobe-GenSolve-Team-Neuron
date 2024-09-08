import numpy as np
import cv2
from deep_sort.deep_sort import DeepSort
from utils.transformation import perspective_transform_point
from utils.geometry import is_inside_quadrilateral, find_angle, find_distance, distance_player_shuttle, distance_shuttle
from TrackNetV3.predict import get_shuttle_pos
hit_count = 0

prev1, prev2, status, hit_frame, hit_coords, hit_shuttle_coords, hit_player,prev_hit_frame, prev_hit_coords = None, None, None, 0, (0,0), None, None,0, (0,0)

def initialize_tracker(deep_sort_weights):
    return DeepSort(model_path=deep_sort_weights, max_age=1000)

def detect_and_track_shuttle(frame_list, w, h):
    return get_shuttle_pos(frame_list, w, h)

def detect_and_track_players(player_model, tracker, frame, court_points, M, warped_court, frame_no):
    # Detect players using player_model
    player_results = player_model(frame, conf=0.5, verbose=False)

    bboxes_xyxy_pl, confs_pl, class_ids_pl = [], [], []

    # Process player detections
    for result in player_results:
        boxes = result.boxes
        xyxy = boxes.xyxy.cpu().numpy()
        conf = boxes.conf.cpu().numpy()
        cls = "pl" + str(boxes.cls.cpu().numpy())
        bboxes_xyxy_pl.append(xyxy)
        confs_pl.append(conf)
        class_ids_pl.append(cls)

    if bboxes_xyxy_pl:
        bboxes_xyxy = np.vstack(bboxes_xyxy_pl)
        confs = np.hstack(confs_pl)
        class_ids = np.hstack(class_ids_pl)

        # Update the tracker with all detected objects (players)
        tracks = tracker.update(bboxes_xyxy, confs, frame)

        return tracks, bboxes_xyxy, class_ids
    return None, None, None

def update_play_area_with_players(bboxes_xyxy, shuttle_pred_dict, court_points, warped_court, M, frame, frame_no):
    global prev1, prev2, status, hit_frame, hit_player, hit_shuttle_coords, prev_hit_frame, hit_coords, hit_count, prev_hit_coords
    play_area_with_players = warped_court.copy()
    track_id = 0
    player_coords = [(), ()]
    player_act_coords = [(), ()]

    if (frame_no > hit_frame):
        prev_hit_frame = hit_frame
        prev_hit_coords = hit_coords

    for bbox in bboxes_xyxy:
        if track_id >= 2:
            break
        x1, y1, x2, y2 = map(int, bbox)
        center_x = (x1 + x2) / 2
        center_y = max(y1, y2)
        act_center_y = (y1 + y2) / 2

        player_act_coords[track_id-1] = [center_x, act_center_y]

        if not is_inside_quadrilateral(court_points, center_x, center_y):
            continue

        track_id += 1
        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 255), 2)
        new_center_x, new_center_y = perspective_transform_point(center_x, center_y, M)
        new_center_y = np.clip(new_center_y, 0, warped_court.shape[0])
        new_center_x = np.clip(new_center_x, 0, warped_court.shape[1])

        if new_center_y > warped_court.shape[0] / 2:
            color = (0, 0, 255)
        else:
            color = (255, 0, 0)

        player_coords[track_id-1] = (new_center_x, new_center_y)

        cv2.circle(play_area_with_players, (int(new_center_x), int(new_center_y)), 5, color, -1)
        cv2.putText(play_area_with_players, f"Player-{track_id}", (int(new_center_x) + 10, int(new_center_y) - 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)

    if len(shuttle_pred_dict) > 0:
        colour = (255, 0, 0)
        angle = 0

        status = None

        if prev1 is not None and prev2 is not None:
            angle = find_angle([shuttle_pred_dict['X'][-1], shuttle_pred_dict['Y'][-1]], prev1, prev2)

        if prev1 != [shuttle_pred_dict['X'][-1], shuttle_pred_dict['Y'][-1]] and shuttle_pred_dict['X'][-1] != 0:
            prev2 = prev1
            prev1 = [shuttle_pred_dict['X'][-1], shuttle_pred_dict['Y'][-1]]
        # print(status)
        if angle > 90 and prev1 is not None and prev1[1] > 250:
            colour = (0, 255, 0)
            if frame_no - hit_frame > 5:
                hit_count += 1
                hit_shuttle_coords = prev1
                hit_frame = frame_no
                hit_coords = player_act_coords

                if prev_hit_coords == (0,0):
                    prev_hit_coords = hit_coords

                # Calculate distance from shuttle to both players
                distance_player_1 = distance_player_shuttle(hit_coords[0], prev1)
                distance_player_2 = distance_player_shuttle(hit_coords[1], prev1)

                # print("Miss:", frame_no-prev_hit_frame)

                # The player closer to the shuttle is the one who hit it

                print("Track HitPlayer", hit_player)

                if hit_player == "Player 2":
                    hit_player = "Player 1"
                else:
                    hit_player = "Player 2"

                # print (hit_player)

                status = "Hit"

        if (distance_shuttle(prev1, [shuttle_pred_dict['X'][-1], shuttle_pred_dict['Y'][-1]])<20 or shuttle_pred_dict['X'][-1]==0) and (frame_no-prev_hit_frame) == 20:
                    status = "Miss"

        for i in range(7, -1, -1):
            cv2.circle(frame, (shuttle_pred_dict['X'][i], shuttle_pred_dict['Y'][i]), 5, colour, -1)
    print("PHC:",prev_hit_coords)
    return play_area_with_players, player_coords, status, hit_player, hit_shuttle_coords,hit_coords,prev_hit_frame, frame_no, [shuttle_pred_dict['X'][-1], shuttle_pred_dict['Y'][-1]], hit_count, prev_hit_coords
