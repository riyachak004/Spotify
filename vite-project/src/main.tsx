import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import TextField from "@mui/material/TextField"
import "../src/style.css"
import axios from 'axios'

const App = () =>{

    const [showSpotifyId, setshowSpotifyId] = useState(false);
    const [spotifyUserId, setSpotifyUserId] = useState("");

    async function activatePlaylistGenerator() {
        console.log("username: ", spotifyUserId);
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/login',
            data: {
                userid: spotifyUserId
            }
          })
            .then(accountResponse => {
                return <h1> Playlists Added! {accountResponse.data}</h1>
            })
            .catch((Error: any) => {
                console.error(Error);
            });   
    }

    return (
        <div>
            <h1> Music Mixin </h1>
            <button 
            onClick={() => {setshowSpotifyId(true)}}> 
            Generate Playlist 
            </button> 
            {showSpotifyId && (
                <div className="spotifyID">
                <TextField
                className='userIdText'
                id="outlined-basic"
                variant="outlined"
                defaultValue="SpotifyId"
                onKeyDown={(e) => {
                    if (e.key == "Enter"){
                        setSpotifyUserId((e.target as HTMLTextAreaElement).value);
                        activatePlaylistGenerator();
                    }
                }}
                />
                </div>
            )}

        </div>
    )
    
};

const rootElement = document.getElementById('root');
if (rootElement){
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App/>);
}