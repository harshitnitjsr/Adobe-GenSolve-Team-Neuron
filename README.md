# GAMESENSE ADOBE

## Overview

GAMESENSE is an advanced sports tracking system designed to provide real-time data analysis, event detection, and performance insights during live gameplay. It currently supports **Badminton** and uses cutting-edge machine learning and computer vision technologies to monitor and enhance the gameplay experience for players, coaches, and spectators.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
  - [Game Selection](#1-game-selection)
  - [Play Area Marking](#2-play-area-marking)
  - [Shuttle/Ball Tracking](#3-shuttleball-tracking)
  - [Player Tracking](#4-player-tracking)
  - [Automated Scoring](#5-automated-scoring)
  - [Rally Length Calculation](#6-rally-length-calculation)
  - [Event Detection](#7-event-detection)
  - [Real-Time Commentary (Bonus)](#8-real-time-commentary-bonus)
  - [Real-Time Graph Analysis](#9-real-time-graph-analysis)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)


---

## Features

### 1. Game Selection
- **Supported Games:**  **Badminton**.


### 2. Play Area Marking
- **Precision Marking:** Automatically detects and marks key areas on the court (boundaries, nets, service lines, etc.) using YOLO object detection.
- **Valid Angles**  It is valid only for one  camera angle.

### 3. Shuttle/Ball Tracking
- **Advanced Tracking:** Continuously tracks the shuttlecock or cocks's position, speed, and trajectory using advanced machine learning algorithms.
- **Real-Time Analysis:** Offers instant feedback on shot speed, angles, and potential outcomes.
- **Event Detection:** Identifies key events like shuttle hitting the net, out-of-bounds shots, and faults.

### 4. Player Tracking
- **Movement Monitoring:** Tracks players' positions and movements on the court using YOLO and deepSort algorithms.
- **Player Mapping:** Visualizes player activity zones and movement patterns on a court map.
- **Player Movement Metrics:** Provides detailed statistics on distance covered, time spent in active zones, and player fatigue.

### 5. Automated Scoring
- **Real-Time Scoring:** Automatically updates scores based on gameplay events (points, fouls, etc.).
- **Scoreboard Integration:** Syncs seamlessly with digital scoreboards to ensure real-time accuracy.

### 6. Rally Length Calculation
- **Rally Metrics:** Tracks and calculates the length of each rally by time, number of shots, and distance covered by players.
- **Detailed Breakdown:** Provides insights into successful rallies, unforced errors, and overall trends.

### 7. Event Detection
- **Key Event Alerts:** Detects critical events such as game points, fouls, faults, and out-of-bounds shots. Sends alerts for immediate action.
- **Highlight Generation:** Automatically compiles key moments for post-game review.

### 8. Real-Time Commentary (Bonus)
- **Automated Commentary:** Using the Gemini API, generates live commentary for the game, including player performance highlights and key events.
- **Text-to-Speech Conversion:** Converts generated commentary into real-time audio for enhanced spectator experience.

### 9. Real-Time Graph Analysis
- **Score Tracking:** Displays a real-time graph showing the current score progression of both players.
- **Shuttlecock Hit Distance:** Provides a graph visualizing the distance covered by the shuttlecock during each hit.
- **Player Speed Analysis:** Continuously monitors and graphs the speed of both players, offering insights into their movements and reactions during the game.



---


## Technologies Used


| Technology/Algorithm | Icon  |
|----------------------|-------|
| YOLO                 | ![YOLO](https://img.shields.io/badge/YOLO-v3-blue) |
| TrackNet v3          | ![TrackNet v3](https://img.shields.io/badge/TrackNet-v3-orange) |
| DeepSort             | ![DeepSort](https://img.shields.io/badge/DeepSort-v2.0-green) |
| OpenCV               | ![OpenCV](https://img.shields.io/badge/OpenCV-3.4.3-brightgreen) |
| NumPy                | ![NumPy](https://img.shields.io/badge/NumPy-1.21-blue) |
| Python               | ![Python](https://img.shields.io/badge/Python-3.8-blue) |
| Next.js              | ![Next.js](https://img.shields.io/badge/Next.js-12.0-black) |
| Socket.io            | ![Socket.io](https://img.shields.io/badge/Socket.io-v4.0-black) |
| Flask                | ![Flask](https://img.shields.io/badge/Flask-v2.0.1-blue) |

### Algorithms Used
- **TrackNet v3**: Used for shuttlecock tracking and trajectory estimation.
- **DeepSort**: Employed for multi-object tracking (players and shuttlecock).
- **YOLO**: Used for detecting players and other objects in real-time.

These tools and algorithms are essential for real-time object detection, tracking, and analysis in our project.



---

