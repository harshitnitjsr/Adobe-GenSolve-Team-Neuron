import cv2
import numpy as np

def perspective_transform_point(x, y, M):
    point = np.array([x, y, 1], dtype="float32").reshape(-1, 1)
    transformed_point = np.dot(M, point)
    transformed_point /= transformed_point[2]
    return transformed_point[0][0], transformed_point[1][0]

def get_perspective_transform(court_points, frame_shape):
    rect_width = int(max(court_points[1][0] - court_points[0][0], court_points[2][0] - court_points[3][0]))
    court_aspect_ratio = 3 / 4
    rect_height = int(rect_width * court_aspect_ratio)
    print(rect_width, rect_height)
    destination_points = np.array([[0, rect_height], [rect_width, rect_height], [rect_width, 0], [0, 0]],
                                  dtype="float32")
    M = cv2.getPerspectiveTransform(court_points, destination_points)
    warped_court = cv2.warpPerspective(frame_shape, M, (rect_width, rect_height))
    return warped_court, M
