import numpy as np
import cv2
from deep_sort.deep_sort import DeepSort
from utils.transformation import perspective_transform_point
from utils.geometry import is_inside_quadrilateral

def initialize_tracker(deep_sort_weights):
    return DeepSort(model_path=deep_sort_weights, max_age=1000)

def detect_and_track_players(player_model, tracker, frame, court_points, M, warped_court):
    results = player_model(frame, conf=0.5, verbose=False)
    bboxes_xyxy, confs, class_ids = [], [], []

    for result in results:
        boxes = result.boxes
        xyxy = boxes.xyxy.cpu().numpy()
        conf = boxes.conf.cpu().numpy()
        cls = boxes.cls.cpu().numpy()
        bboxes_xyxy.append(xyxy)
        confs.append(conf)
        class_ids.append(cls)

    if bboxes_xyxy:
        bboxes_xyxy = np.vstack(bboxes_xyxy)
        confs = np.hstack(confs)
        class_ids = np.hstack(class_ids)
        tracks = tracker.update(bboxes_xyxy, confs, frame)

        return tracks, bboxes_xyxy
    return None, None

def update_play_area_with_players(bboxes_xyxy, court_points, warped_court, M, frame):
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

    return play_area_with_players

