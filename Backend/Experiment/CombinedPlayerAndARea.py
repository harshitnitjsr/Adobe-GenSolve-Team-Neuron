import cv2
import numpy as np
from ultralytics import YOLO
from deep_sort.deep_sort import DeepSort
import torch


def is_point_in_triangle(x1, y1, x2, y2, x3, y3, x, y):
    # Calculate area of the triangle ABC
    area_ABC = abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0)

    # Calculate area of the triangle PAB
    area_PAB = abs((x * (y1 - y2) + x1 * (y2 - y) + x2 * (y - y1)) / 2.0)

    # Calculate area of the triangle PBC
    area_PBC = abs((x * (y2 - y3) + x2 * (y3 - y) + x3 * (y - y2)) / 2.0)

    # Calculate area of the triangle PCA
    area_PCA = abs((x * (y3 - y1) + x3 * (y1 - y) + x1 * (y - y3)) / 2.0)

    # Check if sum of PAB, PBC, PCA is the same as ABC
    return area_ABC == (area_PAB + area_PBC + area_PCA)


def isInsideQuadrilateral(corners, x, y):
    [x1,y1],[x2,y2],[x3,y3],[x4,y4] = corners
    # Check if point (x, y) is inside triangle (x1, y1), (x2, y2), (x3, y3)
    inside_triangle_1 = is_point_in_triangle(x1, y1, x2, y2, x3, y3, x, y)

    # Check if point (x, y) is inside triangle (x1, y1), (x3, y3), (x4, y4)
    inside_triangle_2 = is_point_in_triangle(x1, y1, x3, y3, x4, y4, x, y)

    # Point is inside the quadrilateral if it's inside either triangle
    return inside_triangle_1 or inside_triangle_2

# Load YOLO models
player_model = YOLO("yolov8n.pt")  # Model to detect players
court_model = YOLO('../Models/PlayAreaDetect.pt')  # Model to detect play area

# Load DeepSort for tracking players
deep_sort_weights = 'deep_sort/deep/checkpoint/ckpt.t7'
tracker = DeepSort(model_path=deep_sort_weights, max_age=1000)

# Load the video
video_path = '../TestVideos/Angle1.mp4'
cap = cv2.VideoCapture(video_path)

def perspective_transform_point(x, y, M):
    # Convert the point to a homogeneous coordinate (x, y, 1)
    point = np.array([x, y, 1], dtype="float32").reshape(-1, 1)

    # Apply the perspective transformation
    transformed_point = np.dot(M, point)

    # Convert back from homogeneous coordinates to Cartesian coordinates
    transformed_point /= transformed_point[2]

    # Return the transformed (x, y) coordinates
    return transformed_point[0][0], transformed_point[1][0]

# Define the device
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

# Step 1: Run video to get court details and transform perspective
while True:
    ret, frame = cap.read()
    if ret:
        court_results = court_model.predict(source=frame, save=False, show=False)
        print(court_results)
        if court_results[0].masks:
            mask = court_results[0].masks.xy[0]
        else:
            continue
        points = np.array(mask, dtype=np.int32)

        # Initialize variables to find the boundary points
        ymin = 9999
        ymax = 0
        xmintop = 9999
        xmaxtop = 0
        xminbottom = 9999
        xmaxbottom = 0

        for pts in points:
            ymax = max(ymax, pts[1])
            ymin = min(ymin, pts[1])
            print("Ymin: ", ymin)

        for pts in points:
            if ymax - 2 <= pts[1] <= ymax + 2:
                xminbottom = min(xminbottom, pts[0])
                xmaxbottom = max(xmaxbottom, pts[0])
            if ymin - 2 <= pts[1] <= ymin + 2:
                xmintop = min(xmintop, pts[0])
                xmaxtop = max(xmaxtop, pts[0])

        # Define the rectangle points in the original image
        court_points = np.array([[xminbottom, ymax], [xmaxbottom, ymax], [xmaxtop, ymin], [xmintop, ymin]], dtype="float32")

        # Define the points for the perspective transform (assuming a 4:3 aspect ratio)
        rect_width = max(xmaxbottom - xminbottom, xmaxtop - xmintop)
        court_aspect_ratio = 3 / 4  # Correct aspect ratio (adjust if necessary)
        rect_height = int(rect_width * court_aspect_ratio)
        destination_points = np.array([[0, rect_height], [rect_width, rect_height], [rect_width, 0], [0, 0]],
                                      dtype="float32")

        # Compute the perspective transform matrix
        M = cv2.getPerspectiveTransform(court_points, destination_points)

        # Warp the play area
        warped_court = cv2.warpPerspective(frame, M, (rect_width, rect_height))
        court = cv2.imread("../TestVideos/Screenshot_20240901_031623.png")
        warped_court = cv2.resize(court, warped_court.shape[:2])
        break

# Release the video after detecting the court
cap.release()

# Step 2: Re-open the video for player detection and tracking
cap = cv2.VideoCapture(video_path)

# Begin processing the video frames
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    og_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = player_model(og_frame, conf=0.5, verbose=False)

    bboxes_xyxy = []
    confs = []
    class_ids = []

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

        tracks = tracker.update(bboxes_xyxy, confs, og_frame)

        # Create a copy of the warped play area to draw on
        play_area_with_players = warped_court.copy()
        track_id = 0
        for bbox in bboxes_xyxy:
            if (track_id>=2):
                break

            x1, y1, x2, y2 = bbox
            x1 = int(x1)
            x2 = int(x2)
            y1 = int(y1)
            y2 = int(y2)

            # Calculate the center of the bounding box
            center_x = (x1 + x2) / 2
            center_y = max(y1, y2)

            if (not isInsideQuadrilateral(court_points, center_x,center_y)):
                continue

            track_id+=1

            cv2.rectangle(frame, (x1,y1), (x2,y2), (255,0,255),2)

            # Adjust the player's position based on the perspective transformation
            new_center_x, new_center_y = perspective_transform_point(center_x, center_y, M)

            if (new_center_y > warped_court.shape[0]/2):
                new_center_y = new_center_y + ymin/2

            # Clip transformed points to ensure they stay within bounds
            new_center_x = np.clip(new_center_x, 0,warped_court.shape[1])
            new_center_y = np.clip(new_center_y, 0,warped_court.shape[0])

            # Draw the player's position on the play area
            color = [(0, 0, 255), (255, 0, 0), (0, 255, 0)][track_id % 3]
            cv2.circle(play_area_with_players, (int(new_center_x), int(new_center_y)), 5, color, -1)
            cv2.putText(play_area_with_players, f"Player-{track_id}", (int(new_center_x) + 10, int(new_center_y) - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)

        # Display the updated play area
        cv2.imshow("Warped Play Area", play_area_with_players)
        cv2.imshow("Original Game", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
