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
