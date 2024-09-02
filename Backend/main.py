import cv2
from ultralytics import YOLO
from utils.video_processing import load_video, detect_court, get_court_boundaries
from utils.transformation import get_perspective_transform
from utils.tracking import initialize_tracker, detect_and_track_players, update_play_area_with_players

def main():
    # Load models
    player_model = YOLO("Models/yolov8n.pt")
    court_model = YOLO('Models/PlayAreaDetect.pt')

    # Load the video
    video_path = 'TestVideos/Angle1.mp4'
    cap = load_video(video_path)

    # Detect court and transform perspective
    ret, frame = cap.read()
    if ret:
        points = detect_court(court_model, frame)
        if points is not None:
            court_points = get_court_boundaries(points)
            warped_court, M = get_perspective_transform(court_points, frame)
            # Use a fixed image instead of the detected one (for demonstration)
            court = cv2.imread("TestVideos/Screenshot_20240901_031623.png")
            warped_court = cv2.resize(court, (warped_court.shape[1], warped_court.shape[0]))  # Fixing resize dimensions
    cap.release()

    # Re-open video for tracking
    cap = load_video(video_path)
    tracker = initialize_tracker('deep_sort/deep/checkpoint/ckpt.t7')

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        actual_frame = frame.copy()

        tracks, bboxes_xyxy = detect_and_track_players(player_model, tracker, frame, court_points, M, warped_court)
        if tracks is not None:
            play_area_with_players = update_play_area_with_players(bboxes_xyxy, court_points, warped_court, M, frame)
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

        yield [actual_frame_bytes, frame_bytes, play_area_with_players_bytes]

    cap.release()

if __name__ == "__main__":
    main()
