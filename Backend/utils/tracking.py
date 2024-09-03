import numpy as np
import cv2
from deep_sort.deep_sort import DeepSort
from utils.transformation import perspective_transform_point
from utils.geometry import is_inside_quadrilateral


def initialize_tracker(deep_sort_weights):
    return DeepSort(model_path=deep_sort_weights, max_age=1000)


def detect_and_track_players(player_model, tracking_model, tracker, frame, court_points, M, warped_court):
    # Detect players using player_model
    player_results = player_model(frame, conf=0.5, verbose=False)
    # Detect shuttlecock using tracking_model
    shuttle_results = tracking_model(frame, conf=0.1, verbose=False, max_det = 1)

    bboxes_xyxy_pl, confs_pl, class_ids_pl = [], [], []
    bboxes_xyxy_sc, confs_sc, class_ids_sc = [], [], []

    # Process player detections
    for result in player_results:
        boxes = result.boxes
        xyxy = boxes.xyxy.cpu().numpy()
        conf = boxes.conf.cpu().numpy()
        cls = "pl" + str(boxes.cls.cpu().numpy())
        bboxes_xyxy_pl.append(xyxy)
        confs_pl.append(conf)
        class_ids_pl.append(cls)

    # Process shuttlecock detections
    for shuttle_result in shuttle_results:
        shuttle_boxes = shuttle_result.boxes
        xyxy = shuttle_boxes.xyxy.cpu().numpy()
        conf = shuttle_boxes.conf.cpu().numpy()
        cls = "sc" + str(shuttle_boxes.cls.cpu().numpy())
        bboxes_xyxy_sc.append(xyxy)
        confs_sc.append(conf)
        class_ids_sc.append(cls)

    # If there are any detections, track and return
    if bboxes_xyxy_pl or bboxes_xyxy_sc:
        bboxes_xyxy = np.vstack(bboxes_xyxy_pl)
        confs = np.hstack(confs_pl)
        class_ids = np.hstack(class_ids_pl)

        # Update the tracker with all detected objects (players + shuttlecock)
        tracks = tracker.update(bboxes_xyxy, confs, frame)



        return tracks, bboxes_xyxy, bboxes_xyxy_sc, class_ids
    return None, None, None


def update_play_area_with_players(bboxes_xyxy,bboxes_xyxy_sc, court_points, warped_court, M, frame):
    play_area_with_players = warped_court.copy()
    track_id = 0
    for bbox in bboxes_xyxy:
        if track_id >= 2:
            break
        x1, y1, x2, y2 = map(int, bbox)
        center_x = (x1 + x2) / 2
        center_y = max(y1, y2)

        if not is_inside_quadrilateral(court_points, center_x, center_y):
            continue

        track_id += 1
        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 255), 2)
        new_center_x, new_center_y = perspective_transform_point(center_x, center_y, M)
        new_center_y = np.clip(new_center_y, 0, warped_court.shape[0])
        new_center_x = np.clip(new_center_x, 0, warped_court.shape[1])

        # if (new_center_y > warped_court.shape[0]/2):
        #     new_center_y += 170

        color = [(0, 0, 255), (255, 0, 0), (0, 255, 0)][track_id % 3]
        cv2.circle(play_area_with_players, (int(new_center_x), int(new_center_y)), 5, color, -1)
        cv2.putText(play_area_with_players, f"Player-{track_id}", (int(new_center_x) + 10, int(new_center_y) - 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)

    # ret, buffer = cv2.imencode('.jpg', frame)
    # frame = buffer.tobytes()
    #
    # yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    print(bboxes_xyxy_sc)
    if len(bboxes_xyxy_sc[0])>0:
        x1, y1, x2, y2 = map(int, bboxes_xyxy_sc[0][0])
        center_x = (x1 + x2) / 2
        center_y = (y1+y2)/2

        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 255), 2)
        new_center_x, new_center_y = perspective_transform_point(center_x, center_y, M)
        new_center_y = np.clip(new_center_y, 0, warped_court.shape[0])
        new_center_x = np.clip(new_center_x, 0, warped_court.shape[1])

        # if (new_center_y > warped_court.shape[0]/2):
        #     new_center_y += 170

        color = [(0, 0, 255), (255, 0, 0), (0, 255, 0)][track_id % 3]
        cv2.circle(play_area_with_players, (int(new_center_x), int(new_center_y)), 5, color, -1)


    return play_area_with_players
