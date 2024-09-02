import cv2
import numpy as np

# Create a single-channel grayscale image (250x250 pixels)
img = np.ones((250, 250), np.uint8)

# Define the source points (polygon vertices)
src_points = np.array([[75, 10], [150, 10], [190, 200], [35, 200]], dtype=np.float32)

# Draw the original polygon on the image
cv2.polylines(img, np.array([src_points.astype(int)]), isClosed=True, color=255)

# Define the destination points (rectangle corners)
dst_points = np.array([[50, 50], [200, 50], [200, 200], [50, 200]], dtype=np.float32)

# Compute the perspective transform matrix
M = cv2.getPerspectiveTransform(src_points, dst_points)

# Perform the perspective transform
transformed_img = cv2.warpPerspective(img, M, (250, 250))

# Display the original and transformed images
cv2.imshow("Original Image", img)
cv2.imshow("Transformed Image", transformed_img)
cv2.waitKey(0)
cv2.destroyAllWindows()
