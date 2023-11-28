import open3d as o3d
import laspy
import numpy as np
import os
import pandas as pd

def las_to_ply(las_file_path):
    
    las = laspy.read(las_file_path)
    
    points = np.vstack((las.x, las.y, las.z)).transpose()
    
    colors = np.vstack((las.red, las.green,
    las.blue)).transpose()
    
    # uncommnet for massive pcd's
    # factor=100
    # decimated_points = points[::factor]
        
    pcd = o3d.geometry.PointCloud()
    pcd.points = o3d.utility.Vector3dVector(points)
    pcd.colors = o3d.utility.Vector3dVector(colors/255) # 65535

    return pcd

def ply_to_obj_with_color(pcd, obj_file_path):
    
    with open(obj_file_path, 'w') as obj_file:
        # Write each point with its color
        for point, color in zip(pcd.points, pcd.colors):
            # Writing vertex position and color in the 'v x y z r g b' format
            obj_file.write("v {} {} {} {} {} {}\n".format(point[0], point[1], point[2], color[0], color[1], color[2]))

    print("Conversion complete. OBJ file saved.")



def main():

    las_file_path = "asset/Las/SaMo_topo_14.las"
    obj_file_path = "asset/OBJ/SaMo_topo_14.obj"

    if not os.path.exists(las_file_path):
        print("File not found:", las_file_path)
        return

    if not las_file_path.lower().endswith('.las'):
        print("The file is not a .las file:", las_file_path)
        return

    pcd = las_to_ply(las_file_path)
    
    ply_to_obj_with_color(pcd, obj_file_path)

if __name__ == "__main__":
    main()