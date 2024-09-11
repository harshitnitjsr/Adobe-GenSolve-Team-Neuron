import cv2
from ultralytics import YOLO
from utils.video_processing import load_video, detect_court, get_court_boundaries
from utils.transformation import get_perspective_transform
from utils.tracking import initialize_tracker, detect_and_track_players, update_play_area_with_players, detect_and_track_shuttle

class FrameList:
    def __init__(self, length):
        self.length = length
        self.lst = []

    def currlength(self):
        return len(self.lst)

    def insert(self, item):
        if len(self.lst) >= self.length:
            self.lst.pop(0)
        self.lst.append(item)

frame_list = FrameList(8)


def main():
    # Load models
    global warped_court
    player_model = YOLO("Models/yolov8n.pt")
    court_model = YOLO('Models/PlayAreaDetect.pt')
    # tracking_model = YOLO("Models/best (12).pt")
    # Load the video
    video_path = 'TestVideos/Badminton.mp4'
    cap = load_video(video_path)

    # Detect court and transform perspective
    ret, frame = cap.read()
    if ret:
        frame_list.insert(frame)
        points = detect_court(court_model, frame)
        if points is not None:
            court_points = get_court_boundaries(points)
            warped_court, M = get_perspective_transform(court_points, frame)
            # Use a fixed image instead of the detected one (for demonstration)
            court = cv2.imread("TestVideos/Screenshot_20240901_031623.png")
            # print(warped_court.shape[1], warped_court.shape[0])
            warped_court = cv2.resize(court, (warped_court.shape[1], warped_court.shape[0]))  # Fixing resize dimensions
    cap.release()

    # Re-open video for tracking
    cap = load_video(video_path)
    tracker = initialize_tracker('deep_sort/deep/checkpoint/ckpt.t7')
    frame_no = 0

    w, h = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
    # print(w,h)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_no += 1
        frame_list.insert(frame)
        # print(frame_list.currlength())

        actual_frame = frame.copy()

        tracks, bboxes_xyxy, class_ids = detect_and_track_players(player_model, tracker,
                                                                                 frame, court_points, M,
                                                                                 warped_court, frame_no)
        
        shuttle_pred_dict = detect_and_track_shuttle(frame_list,w,h)

        if tracks is not None:
            play_area_with_players, player_coords, status, hitplayer, hit_shuttle_coords,hit_coords,prev_hit_frame, frame_no, shuttle_curr_coords, hit_count, prev_hit_coords = update_play_area_with_players(bboxes_xyxy, shuttle_pred_dict,court_points, warped_court, M, frame, frame_no)
            cv2.imshow("Warped Play Area", play_area_with_players)
            cv2.imshow("Original Game", frame)


        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        ret, buffer0 = cv2.imencode('.jpg', actual_frame)
        actual_frame_bytes = buffer0.tobytes()

        ret, buffer1 = cv2.imencode('.jpg', frame)
        frame_bytes = buffer1.tobytes()

        ret, buffer2 = cv2.imencode('.jpg', play_area_with_players)
        play_area_with_players_bytes = buffer2.tobytes()

        yield [actual_frame_bytes, frame_bytes, play_area_with_players_bytes, player_coords, status, hitplayer, hit_shuttle_coords,hit_coords, prev_hit_frame, frame_no, shuttle_curr_coords, hit_count,prev_hit_coords]

    cap.release()


if __name__ == "__main__":
    main()
