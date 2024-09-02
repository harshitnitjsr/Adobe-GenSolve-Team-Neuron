from ultralytics import YOLO
from deep_sort.deep_sort import DeepSort
import cv2
import torch
import time
import numpy as np

deep_sort_weights = 'deep_sort/deep/checkpoint/ckpt.t7'
tracker = DeepSort(model_path=deep_sort_weights, max_age=1000)

video_path = '../TestVideos/Angle1.mp4'
cap = cv2.VideoCapture(video_path)

device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

unique_track_ids = set()
start_time = time.perf_counter()
counter, fps = 0, 0

model = YOLO("yolov8n.pt")

while cap.isOpened():
    ret, frame = cap.read()

    if not ret:
        break

    og_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = model(og_frame, max_det=2)

    bboxes_xywh = []
    confs = []
    class_ids = []

    for result in results:
        boxes = result.boxes
        xywh = boxes.xywh.cpu().numpy()
        conf = boxes.conf.cpu().numpy()
        cls = boxes.cls.cpu().numpy()

        bboxes_xywh.append(xywh)
        confs.append(conf)
        class_ids.append(cls)

    if bboxes_xywh:
        bboxes_xywh = np.vstack(bboxes_xywh)
        confs = np.hstack(confs)
        class_ids = np.hstack(class_ids)

        tracks = tracker.update(bboxes_xywh, confs, og_frame)

        for track in tracker.tracker.tracks:
            if not track.is_confirmed() or track.time_since_update > 1:
                continue

            track_id = track.track_id
            unique_track_ids.add(track_id)
            x1, y1, x2, y2 = track.to_tlbr()

            color = [(0, 0, 255), (255, 0, 0), (0, 255, 0)][track_id % 3]
            cv2.rectangle(og_frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)

            cv2.putText(og_frame, f"Player-{track_id}", (int(x1) + 10, int(y1) - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                        (0, 0, 0), 1, cv2.LINE_AA)

        current_time = time.perf_counter()
        elapsed = (current_time - start_time)
        counter += 1
        if elapsed > 1:
            fps = counter / elapsed
            counter = 0
            start_time = current_time

        cv2.putText(og_frame, f"FPS: {fps:.2f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

        cv2.imshow("Video", og_frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
