import pandas as pd

vertices = []

with open('asset/SaMo_topo_8.obj', 'r') as file:
    for line in file:
        if line.startswith('v '):
            vertices.append(list(map(float, line.strip().split()[1:])))

# Assuming 'vertices' is a list of [x, y, z] coordinates
vertices_df = pd.DataFrame(vertices, columns=['x', 'y', 'z'])

# Assuming vertices_df is your DataFrame with columns 'x', 'y', 'z'
# Calculating the mean of each column
mean_x = vertices_df['x'].mean()
mean_y = vertices_df['y'].mean()
mean_z = vertices_df['z'].mean()

# Subtracting the means from their respective columns
vertices_df['x'] = vertices_df['x'] - mean_x
vertices_df['y'] = vertices_df['y'] - mean_y
vertices_df['z'] = vertices_df['z'] - mean_z

def write_obj_file(vertices_df, file_name):
    with open(file_name, 'w') as file:
        # Write vertices
        for index, row in vertices_df.iterrows():
            file.write(f"v {row['x']} {row['y']} {row['z']}\n")

# Example usage
write_obj_file(vertices_df, 'adjusted_model.obj')