import pandas as pd
import numpy as np
from request import createSpecificPlaylist

# Read the CSV file
df = pd.read_csv('Data.csv')
frame = pd.DataFrame(df)


# Added to create a house/edm playlist

playlist = set()
songs = set()

for item in range(0,len(df)):
    row = df.iloc[item]
    if str(row["Genres"]) == row["Genres"]:
        genres = row["Genres"].split(',')
        genres_set = set()
        for genre in genres: 
            genres_set.add(genre)
            print("genres set: ", genres_set)
        if "edm" in genres_set or "house" in genres_set:
            playlist.add(row["Spotify_ID"])
            songs.add(row["Track_Name"])


createSpecificPlaylist(list(playlist), "HOUSE/EDM")


