import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder
from request import createPlaylist

# ReadME
# Using K-Clustering (unsupervised learning so don't have to label any data!) 
# Picks an arbitrary center and then finds values close to it (vectors of n dimension)
# Then finds another center that minimizes the distance, repeats this 
# Will print out the different clusters in a csv file

# Read the CSV file
df = pd.read_csv('TrainingData.csv')

# # Initialize the LabelEncoder
# encoder = LabelEncoder()

# # Fit the LabelEncoder and transform the 'Genre' column
# df['Genres'] = encoder.fit_transform(df['Genres'])

# Spotify_ID,Artist_IDs,Track_Name,Album_Name,Artist_Name,Release_Date,Duration,Popularity,Added_By,Added_At,Genres,Danceability,Energy,Key,Loudness,Mode,Speechiness,Acousticness,Instrumentalness,Liveness,Valence,Tempo,Time_Signature

# Extract the numerical features (assuming the first column is 'song_title' and the rest are numerical features)
features = df.drop(columns=['Spotify_ID','Artist_IDs', 'Track_Name', 'Album_Name', 'Artist_Name', 'Release_Date', 
                            'Duration', 'Popularity', 'Added_By', 'Added_At', 'Genres']).values

# Standardize the features
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

# Choose the number of clusters [number of playlists]
n_clusters = 3

# Initialize and fit the KMeans model - set to 42 as the random seed - ensures you get the same results each time
# if you don't set the random state then will be non-deterministic 
kmeans = KMeans(n_clusters=n_clusters, init='k-means++', random_state=42)
kmeans.fit(features_scaled)

# Get the cluster assignments
df['cluster'] = kmeans.labels_
# Sort the DataFrame by the 'cluster' column
df_sorted = df.sort_values(by='cluster').reset_index(drop=True)

createPlaylist(df, n_clusters)

# Create a DataFrame to hold the organized rows with separators
df_with_separators = pd.DataFrame(columns=df_sorted.columns)

# Add a row of NaNs between different clusters
current_cluster = df_sorted.loc[0, 'cluster']
for i, row in df_sorted.iterrows():
    if row['cluster'] != current_cluster:
        current_cluster = row['cluster']
        # Add a row of NaNs to separate clusters
        df_with_separators = df_with_separators._append(pd.Series([np.nan]*len(row), index=df_with_separators.columns), ignore_index=True)
    df_with_separators = df_with_separators._append(row, ignore_index=True)

# Save the sorted DataFrame with separators to a new CSV file

intermediate = df_with_separators[['Track_Name','Artist_Name']]
intermediate.to_csv('sorted_clusters.csv', index=False)

