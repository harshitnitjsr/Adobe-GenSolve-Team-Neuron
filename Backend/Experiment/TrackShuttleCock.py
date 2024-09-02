import torch
import torch.nn as nn
import cv2
import numpy as np


# Define the model architecture (example)
class TrackNet(nn.Module):
    def __init__(self):
        super(TrackNet, self).__init__()
        # Define the layers of your model
        self.conv1 = nn.Conv2d(3, 64, kernel_size=3, padding=1)
        # Add other layers according to the architecture

    def forward(self, x):
        # Define the forward pass
        x = self.conv1(x)
        # Forward through the rest of the layers
        return x


# Instantiate the model
model = TrackNet()

# Load the entire checkpoint
checkpoint = torch.load('../Models/TrackNet_best.pt', map_location=torch.device('cpu'))

# Extract the model state dict from the checkpoint
model_state_dict = checkpoint['model']

# Load the state dict into the model
model.load_state_dict(model_state_dict)

# Set the model to evaluation mode
model.eval()

# Load the video
video_path = 'path_to_your_video.mp4'
cap = cv2.VideoCapture(video_path)

# Check if video opened successfully
if not cap.isOpened():
    print("Error: Could not open video.")
    exit()

# Get the video frame width, height, and frames per second (fps)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)

# Define the codec and create VideoWriter object
out = cv2.VideoWriter('output_video.mp4', cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Preprocess the frame for the model
    input_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    input_frame = cv2.resize(input_frame, (width, height))  # Resize as per model's input size
    input_frame = input_frame / 255.0  # Normalize to [0, 1]
    input_tensor = torch.tensor(input_frame).permute(2, 0, 1).unsqueeze(0).float()

    # Forward pass to get the prediction
    with torch.no_grad():
        output = model(input_tensor)

    # Post-process the output to extract the shuttlecock position
    output_np = output.squeeze().cpu().numpy()
    position = np.unravel_index(np.argmax(output_np, axis=None), output_np.shape)

    # Draw the shuttlecock position on the frame
    cv2.circle(frame, (position[1], position[0]), 5, (0, 255, 0), -1)

    # Write the frame into the output video
    out.write(frame)

    # Display the frame (optional)
    cv2.imshow('Shuttlecock Tracking', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture and writer objects
cap.release()
out.release()
cv2.destroyAllWindows()
