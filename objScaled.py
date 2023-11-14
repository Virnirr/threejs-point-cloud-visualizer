import pandas as pd

def read_obj_file(file_path):
    vertices = []
    with open(file_path, 'r') as file:
        for line in file:
            if line.startswith('v '):
                # Extracting x, y, z coordinates along with r, g, b color values
                vertices.append(list(map(float, line.strip().split()[1:])))
    return vertices

def adjust_vertices(vertices):
    # Creating a DataFrame with columns for position and color
    vertices_df = pd.DataFrame(vertices, columns=['x', 'y', 'z', 'r', 'g', 'b'])

    # Calculating and subtracting the mean of each position column
    for axis in ['x', 'y', 'z']:
        mean_value = vertices_df[axis].mean()
        vertices_df[axis] -= mean_value

    return vertices_df

def write_obj_file(vertices_df, file_name):
    with open(file_name, 'w') as file:
        # Write vertices along with their color information
        for index, row in vertices_df.iterrows():
            file.write(f"v {row['x']} {row['y']} {row['z']} {row['r']} {row['g']} {row['b']}\n")
    print(f"File written: {file_name}")

def main():
    input_file_path = '/mnt/c/Users/ybinb/VS/lidar-processing/data/ind_scans/SaMo_topo_8_color.obj'
    output_file_path = '/mnt/c/Users/ybinb/VS/lidar-processing/data/ind_scans/SaMo_topo_8_color_scaled.obj'
    vertices = read_obj_file(input_file_path)
    adjusted_vertices_df = adjust_vertices(vertices)
    write_obj_file(adjusted_vertices_df, output_file_path)

if __name__ == "__main__":
    main()
