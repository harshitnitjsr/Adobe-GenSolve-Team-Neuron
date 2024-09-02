import cv2
import numpy as np
from ultralytics import YOLO

def load_video(video_path):
    return cv2.VideoCapture(video_path)

def detect_court(court_model, frame):
    court_results = court_model.predict(source=frame, save=False, show=False)
    if court_results[0].masks:
        mask = court_results[0].masks.xy[0]
        points = np.array(mask, dtype=np.int32)
        return points
    return None

def get_court_boundaries(points):
    ymin, ymax = min(points[:, 1]), max(points[:, 1])
    xmintop, xmaxtop = min(points[points[:, 1] == ymin, 0]), max(points[points[:, 1] == ymin, 0])
    xminbottom, xmaxbottom = min(points[points[:, 1] == ymax, 0]), max(points[points[:, 1] == ymax, 0])
    court_points = np.array([[xminbottom, ymax], [xmaxbottom, ymax], [xmaxtop, ymin], [xmintop, ymin]], dtype="float32")
    return court_points

