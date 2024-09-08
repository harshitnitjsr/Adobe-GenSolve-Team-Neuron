import numpy as np

def is_point_in_triangle(x1, y1, x2, y2, x3, y3, x, y):
    area_ABC = abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0)
    area_PAB = abs((x * (y1 - y2) + x1 * (y2 - y) + x2 * (y - y1)) / 2.0)
    area_PBC = abs((x * (y2 - y3) + x2 * (y3 - y) + x3 * (y - y2)) / 2.0)
    area_PCA = abs((x * (y3 - y1) + x3 * (y1 - y) + x1 * (y - y3)) / 2.0)
    return area_ABC == (area_PAB + area_PBC + area_PCA)

def is_inside_quadrilateral(corners, x, y):
    [x1, y1], [x2, y2], [x3, y3], [x4, y4] = corners
    inside_triangle_1 = is_point_in_triangle(x1, y1, x2, y2, x3, y3, x, y)
    inside_triangle_2 = is_point_in_triangle(x1, y1, x3, y3, x4, y4, x, y)
    return inside_triangle_1 or inside_triangle_2

def find_distance(x1, y1, x2, y2):
    distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
    return distance


def distance_player_shuttle(player, shuttle):
    print(player, shuttle)
    if player != () and shuttle != []:

        return np.sqrt((player[0]-shuttle[0])**2 + (player[1]-shuttle[1])**2)
    return np.inf

def distance_shuttle(pt1, pt2):
    try:
        return np.sqrt((pt1[0]-pt2[0])**2 + (pt1[1]-pt2[1])**2)
    except:
        return np.inf

def find_angle(currpoints, prev1, prev2):
    x1, x2, x3 = (currpoints[0], prev1[0], prev2[0])
    y1, y2, y3 = (currpoints[1], prev1[1], prev2[1])

    print((x1,y1), (x2,y2),(x3,y3))


    V1 = np.array([x2 - x1, y2 - y1])  
    V2 = np.array([x3 - x2, y3 - y2])  

    magnitude_V1 = np.linalg.norm(V1)
    magnitude_V2 = np.linalg.norm(V2)

    dot_product = np.dot(V1, V2)
    
    if magnitude_V1!=0 and magnitude_V2!=0:
        cos_theta = dot_product / (magnitude_V1 * magnitude_V2)
    else:
        cos_theta = 0

    angle = np.arccos(cos_theta) * (180 / np.pi)

    return angle
