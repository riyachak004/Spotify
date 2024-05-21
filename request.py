import requests
import webbrowser

def createPlaylist(df, n_clusters): 

    # Step 1: Register your application and get client ID, client secret, and set the redirect URI
    client_id = '9bfa637adec64d2a900f4a6f38f7b300'
    client_secret = '5905aa2bac594662b7b1484b64e1fc7f'
    redirect_uri = 'http://localhost:8888/callback'
    scopes = 'playlist-modify-public playlist-modify-private'

    # Step 2: Authorization Request
    auth_url = f'https://accounts.spotify.com/authorize?response_type=code&client_id={client_id}&scope={scopes}&redirect_uri={redirect_uri}'
    webbrowser.open(auth_url)

    # Step 3: Assume we have received the authorization code from the callback
    auth_code = input('Enter the authorization code: ')

    # Step 4: Exchange Authorization Code for Access Token
    token_url = 'https://accounts.spotify.com/api/token'
    payload = {
        'grant_type': 'authorization_code',
        'code': auth_code,
        'redirect_uri': redirect_uri,
        'client_id': client_id,
        'client_secret': client_secret
    }

    response = requests.post(token_url, data=payload)

    if response.status_code == 200:
        token_info = response.json()
        access_token = token_info['access_token']
        print('Access token:', access_token)

        # Step 5: Create a new playlist
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }

        for cluster in range(n_clusters):
            cluster_df = df[df['cluster'] == cluster] # subset of the songs of the same cluster
            num_str = '{}'.format(cluster)
            playlistName = 'GEN Playlist ' + num_str
                
            body = {
                "name": playlistName,
                "description": "New playlist description",
                "public": False
            }

            user_id = '' # insert user id here
            url = f'https://api.spotify.com/v1/users/{user_id}/playlists'

            response = requests.post(url, headers=headers, json=body)

            if response.status_code == 201:
                print('Playlist created successfully\n')
                playlist = response.json()
                playlist_id = playlist['id']

                # Add tracks to the playlist
                songUri = cluster_df['Spotify_ID']

                subLists = [songUri[i:i + 100] for i in range(0, len(songUri), 100)]
                count = 0
                for list in subLists:
                    print("iteration: ", count)
                    count+=1
                    track_uris = []
                    for song in list: 
                        trackUri = 'spotify:track:' + song
                        track_uris.append(trackUri)

                    add_tracks_url = f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks'

                    add_tracks_payload = {
                        'uris': track_uris
                    }

                    add_tracks_response = requests.post(add_tracks_url, headers=headers, json=add_tracks_payload)

                    if add_tracks_response.status_code == 201 or add_tracks_response.status_code == 200:
                        print('Tracks added successfully\n')
                    else:
                        print(f'Failed to add tracks: {add_tracks_response.status_code}')
                        print(add_tracks_response.json())
                        exit()
                    
            else:
                print(f'Failed to create playlist: {response.status_code}')
                print(response.json())
    else:
        print('Failed to get token:', response.status_code)
        print(response.json())


    


