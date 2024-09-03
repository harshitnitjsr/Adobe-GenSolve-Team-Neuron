import ultralytics
from ultralytics import YOLO

model=YOLO("best (12).pt")

result = model(source=0,show=True, conf=0.1)
