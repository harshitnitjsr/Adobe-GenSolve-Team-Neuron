import cv2
import numpy as np
from ultralytics import YOLO

# Load the YOLO model
model = YOLO('../Models/PlayAreaDetect.pt')

# Predict the play area
results = model.predict(source='../TestVideos/Screenshot_20240901_044428.png', save=False, show=False)
cv2.waitKey(0)

# Get the mask of the detected play area
mask = results[0].masks.xy[0]

# Read the image
image = cv2.imread('../TestVideos/Screenshot_20240901_044428.png')

# Convert the mask points to integers
points = np.array(mask, dtype=np.int32)

# Initialize variables to find the boundary points
ymin = 9999
ymax = 0

for pts in points:
    ymax = max(ymax, pts[1])
    ymin = min(ymin, pts[1])

xmintop = 9999
xmaxtop = 0
xminbottom = 9999
xmaxbottom = 0

for pts in points:
    if ymax-10 <= pts[1] <= ymax+10:
        xminbottom = min(xminbottom, pts[0])
        xmaxbottom = max(xmaxbottom, pts[0])
    if ymin-10 <= pts[1] <= ymin+10:
        xmintop = min(xmintop, pts[0])
        xmaxtop = max(xmaxtop, pts[0])

# Define the rectangle points in the original image
points = np.array([[xminbottom, ymax], [xmaxbottom, ymax], [xmaxtop, ymin], [xmintop, ymin]], dtype="float32")

# Define the points for the perspective transform
# Assuming a 4:3 aspect ratio for the play area
rect_width = max(xmaxbottom - xminbottom, xmaxtop - xmintop)
rect_height = int(rect_width * 3 / 4)  # For a 4:3 aspect ratio

destination_points = np.array([[0, rect_height], [rect_width, rect_height], [rect_width, 0], [0, 0]], dtype="float32")

# Compute the perspective transform matrix
M = cv2.getPerspectiveTransform(points, destination_points)

# Perform the perspective transform
warped = cv2.warpPerspective(image, M, (rect_width, rect_height))

playArea = cv2.imread("../TestVideos/Screenshot_20240901_044428.png")
playArea = cv2.resize(playArea, warped.shape[:2])

# Show the transformed image
cv2.imshow('Warped Play Area', warped)
cv2.waitKey(0)
cv2.destroyAllWindows()
