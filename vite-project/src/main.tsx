import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import TextField from "@mui/material/TextField"
import "../src/style.css"
import axios from 'axios'
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';


interface SpotifyFormData {
    spotifyUserId: string; 
    quantityK: number; 
    genre: string; 
}

enum FormType {
    Mood = "mood", 
    Genre = "genre", 
    Recs = "recs"
}

const App = () =>{

    const [showSpotifyId, setshowSpotifyId] = useState(false);
    const [showGeneratePlaylist, setGeneratePlaylist] = useState(false);
    const [showSongRecommendations, setSongRecommendations] = useState(false);
    const [formData, setFormData] = useState<SpotifyFormData> ({
        spotifyUserId: '',
        quantityK: 1,
        genre: ''
    })

    const handleFormFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevData => ({...prevData, [name]: value}));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        console.log("prevent refresh")
        if (showSpotifyId){
            console.log("user id: ", formData.spotifyUserId)
            activatePlaylistGenerator(formData.spotifyUserId, formData.quantityK); 
        }
        else if (showGeneratePlaylist){
            //activateGenrePlaylistGenerator(userid, genre); 
        }
        else if (showSongRecommendations){
            // activateSongRecGenerator(); 
        }
    };

    function setChoice(category: string){
        setshowSpotifyId(false);
        setGeneratePlaylist(false);
        setSongRecommendations(false);
        if (category == FormType.Mood){
            setshowSpotifyId(true);
        }
        if (category == FormType.Genre){
            setGeneratePlaylist(true);
        }
        if (category == FormType.Recs){
            setSongRecommendations(true);
        }
    }

    async function activateGenrePlaylistGenerator(spotifyUserId: string, genre: string){
        console.log("username: ", spotifyUserId);
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/genre',
            data: {
                userid: spotifyUserId,
                genre: genre
            }
          })
            .then(accountResponse => {
                return <h1> Playlists Added! {accountResponse.data}</h1>
            })
            .catch((Error: any) => {
                console.error(Error);
            });  

    }

    async function activatePlaylistGenerator(spotifyUserId: string, playlistK: number) {
        console.log("username: ", spotifyUserId);
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/userid',
            data: {
                userid: spotifyUserId,
                playlistK: playlistK
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
            className="mainOptions"
            onClick={() => {setChoice("mood")}}> 
            Generate mood specific playlists 
            </button> 
            <button 
            className="mainOptions"
            onClick={() => {setChoice("genre")}}> 
            Make a Genre Playlist 
            </button> 
            <button 
            className="mainOptions"
            onClick={() => {setChoice("recs")}}> 
            Get some recs
            </button> 
            
            {showSpotifyId && (
                <form id="spotifyForm" onSubmit={handleSubmit}>
                <div className="container">
                <p> Attach a csv of your liked music here and enter your spotifyid. Given this information
                    I can classify your songs and create K distinct playlists! </p>
                <div className="userIdText">
                <TextField
                name="spotifyUserId"
                id="outlined-basic"
                variant="outlined"
                label="SpotifyId"
                onChange={handleFormFieldChange}
                />
                </div>
                <div className="userIdText">
                <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                // startIcon={<CloudUploadIcon />}
                >
                Upload file
                {/* <VisuallyHiddenInput type="file" /> */}
                </Button>
                </div>
                <div className="userIdText">
                    <TextField
                    name="quantityK"
                    label="Number of Playlists"
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="spotifyid"
                    onChange={handleFormFieldChange}
                    />
                </div>
                <Button variant="outlined" type="submit">Outlined</Button>
                </div>
                </form>
            )}
            {showGeneratePlaylist && (
                <div className="container">

                </div>
            )

            }
            {showSongRecommendations && (
                <div className="container">

                </div>
            )

            }
            
        </div>
    )
    
};

const rootElement = document.getElementById('root');
if (rootElement){
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App/>);
}
