from ultralytics import YOLO
model = YOLO('../Models/TrackNet_best.pt')

model.predict(source='../TestVideos/Angle1.mp4', save=False, show=True)