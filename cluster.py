import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder
from request import createPlaylist, getAuth
from flask import Flask, redirect, request, jsonify, json
from flask_cors import CORS, cross_origin
# from requests_oauthlib import OAuth2Session
# from requests.auth import HTTPBasicAuth
import requests

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# AUTH_URL = 'https://accounts.spotify.com/authorize'
# TOKEN_URL = 'https://accounts.spotify.com/api/token'
# REDIRECT_URI = 'http://127.0.0.1:5000/callback' # my case is 'http://localhost:3000/callback'
# # try this one too: http://localhost:8888/callback
# CLIENT_ID = "9bfa637adec64d2a900f4a6f38f7b300"
# CLIENT_SECRET = "5905aa2bac594662b7b1484b64e1fc7f"
# SCOPE = [
#     "playlist-modify-public",
#     "playlist-modify-private"
# ]

# @app.route("/login")
# def login():
#     spotify = OAuth2Session(CLIENT_ID, scope=SCOPE, redirect_uri=REDIRECT_URI)
#     authorization_url, state = spotify.authorization_url(AUTH_URL)
#     output = redirect(authorization_url)
#     print("this is the output: ", output)

# @app.route("/callback", methods=['GET'])
# def callback():
#     code = request.args.get('code')
#     res = requests.post(TOKEN_URL,
#         auth=HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET),
#         data={
#             'grant_type': 'authorization_code',
#             'code': code,
#             'redirect_uri': REDIRECT_URI
#         })
#     response = json.dumps(res.json())
#     print("response: ", response)
#     return response


@app.route('/userid', methods=['POST'])
def creatingplaylistFunction(): 
    # Read the CSV file
    requestInfo = request.data
    
    data = json.loads(requestInfo.decode('utf-8'))
    userid = data["userid"]

    df = pd.read_csv('Data.csv')



    if data["type"] == "default":
        playlistK = int(data["playlistK"])

        # Spotify_ID,Artist_IDs,Track_Name,Album_Name,Artist_Name,Release_Date,Duration,
        # Popularity,Added_By,Added_At,Genres,Danceability,Energy,Key,Loudness,Mode,Speechiness,
        # Acousticness,Instrumentalness,Liveness,Valence,Tempo,Time_Signature

        # Extract only the numerical features 
        features = df.drop(columns=['Spotify_ID','Artist_IDs', 'Track_Name', 'Album_Name', 'Artist_Name', 'Release_Date', 
                                    'Duration', 'Popularity', 'Added_By', 'Added_At', 'Genres']).values

        # Standardize the features (z-scores)
        scaler = StandardScaler()
        features_scaled = scaler.fit_transform(features)

        # Choose the number of clusters [number of playlists]
        n_clusters = playlistK

        # Initialize and fit the KMeans model - set to 42 as the random seed - ensures you get the same results each time
        # if you don't set the random state then will be non-deterministic 
        # this greedly chooses the first clustering 
        kmeans = KMeans(n_clusters=n_clusters, init='k-means++', random_state=42)
        kmeans.fit(features_scaled)

        # Get the cluster assignments (adding to df)
        df['cluster'] = kmeans.labels_

        # Sort the DataFrame by the 'cluster' column
        df_sorted = df.sort_values(by='cluster').reset_index(drop=True)

        headers = getAuth(userid)
        createPlaylist(df, n_clusters, headers)

        # Organize DataFrame by cluster value (easy way to view playlists before adding them to Spotify user)
        df_with_separators = pd.DataFrame(columns=df_sorted.columns)

        # Add a row of NaNs between different clusters
        current_cluster = df_sorted.loc[0, 'cluster']
        for i, row in df_sorted.iterrows():
            if row['cluster'] != current_cluster:
                current_cluster = row['cluster']
                # Add a row of NaNs to separate clusters
                df_with_separators = df_with_separators._append(pd.Series([np.nan]*len(row), index=df_with_separators.columns), ignore_index=True)
            df_with_separators = df_with_separators._append(row, ignore_index=True)

        # Save the sorted DataFrame with separators to a new CSV file containing Track Name and Artist Name
        intermediate = df_with_separators[['Track_Name','Artist_Name']]
        intermediate.to_csv('sorted_clusters.csv', index=False)

    
    if data["type"] == "genre":
        output_list = []
        genre = data["genre"]

        id_list = df['Spotify_ID'].tolist()
        genre_list = df['Genres'].tolist()
        df["cluster"] = np.nan

        for iteration in range(len(genre_list)):
            if str(genre_list[iteration]) == genre_list[iteration]:
                split_genre_list = genre_list[iteration].split(',')
                if genre in split_genre_list: 
                    df.loc[iteration, 'cluster'] = 0
                    output_list.append(id_list[iteration])
    
        headers = getAuth(userid)
        createPlaylist(df, 1, headers)
    
    return "Playlists Added!"

@app.route('/genre', methods=['GET'])
def queryGenres(): 
    # requestInfo = request.data
    
    # data = json.loads(requestInfo.decode('utf-8'))

    df = pd.read_csv('Data.csv')

    genre_list = df['Genres'].tolist()
    genre_set = set()

    for iteration in range(len(genre_list)):
            if str(genre_list[iteration]) == genre_list[iteration]:
                split_genre_list = genre_list[iteration].split(',')
                for genre in split_genre_list: 
                    genre_set.add(genre)

    genre_list = list(genre_set)
    del genre_list[10:]
    return genre_list


    
if __name__ == '__main__':
    app.run(debug=True)