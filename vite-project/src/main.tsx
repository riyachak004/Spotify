import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import TextField from "@mui/material/TextField"
import "../src/style.css"
import axios from 'axios'
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
// import LoadingButton from '@mui/lab/LoadingButton';
// import Typewriter from 'typewriter-effect';


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


{/* <Typewriter
  onInit={(typewriter) => {
    typewriter.typeString('Hello World!')
      .callFunction(() => {
        console.log('String typed out!');
      })
      .pauseFor(2500)
      .deleteAll()
      .callFunction(() => {
        console.log('All strings were deleted');
      })
      .start();
  }}
/> */}

const App = () =>{

    const [showSpotifyId, setshowSpotifyId] = useState(false);
    const [showGeneratePlaylist, setGeneratePlaylist] = useState(false);
    const [showSongRecommendations, setSongRecommendations] = useState(false);
    const [formData, setFormData] = useState<SpotifyFormData> ({
        spotifyUserId: '',
        quantityK: 1,
        genre: ''
    })
    const [genreList, setGenreList] = useState([])

    const handleFormFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prevData => ({...prevData, [name]: value}));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        if (showSpotifyId){
            activatePlaylistGenerator(formData.spotifyUserId, formData.quantityK); 
        }
        else if (showGeneratePlaylist){
            activateGenrePlaylistGenerator(formData.spotifyUserId, formData.genre); 
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
            setGenreList([])
            setshowSpotifyId(true);
        }
        if (category == FormType.Genre){
            setGeneratePlaylist(true);
        }
        if (category == FormType.Recs){
            setGenreList([])
            setSongRecommendations(true);
        }
    }

    async function activateGenrePlaylistGenerator(spotifyUserId: string, genre: string){
        console.log("username: ", spotifyUserId);
        axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/userid',
            data: {
                type: "genre",
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
                type: "default",
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

    async function genreQuery(){
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/genre',
            data: {
                type: "genreQuery"
            }
          })
            .then(function(response) {
                setGenreList(response.data)
            })
            .catch((Error: any) => {
                console.error(Error);
            });   

    }

    return (
        <div>
            <h1> Music Mixin </h1>
            <button 
                className={showSpotifyId ? 'mainOptionsSelected': 'mainOptions'}
                onClick={() => {setChoice("mood")}}> 
                Generate mood specific playlists 
            </button> 
            <button 
                className={showGeneratePlaylist ?'mainOptionsSelected': 'mainOptions'}
                onClick={() => {setChoice("genre")}}> 
                Make a Genre Playlist 
            </button> 
            <button 
                className={showSongRecommendations ? 'mainOptionsSelected': 'mainOptions'}
                onClick={() => {setChoice("recs")}}> 
                Get some recs
            </button> 
            
            {showSpotifyId && (
                <form id="spotifyForm" onSubmit={handleSubmit}>
                <div className="container">
                <p> Let's create some cohesive mood playlists with your liked songs! </p>
                <div className="formButton">
                    <TextField
                        name="spotifyUserId"
                        id="outlined-basic"
                        variant="outlined"
                        label="SpotifyId"
                        onChange={handleFormFieldChange}
                    />
                </div>
                <div className="formButton">
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
                <div className="formButton">
                    <TextField
                        name="quantityK"
                        label="Number of Playlists"
                        id="outlined-basic"
                        variant="outlined"
                        placeholder="spotifyid"
                        onChange={handleFormFieldChange}
                    />
                </div>
                <Button 
                    className="submitButton" 
                    variant="outlined" 
                    type="submit">
                    Submit
                </Button>
                </div>
                </form>
            )}
            {showGeneratePlaylist && (
                <div className="container">
                <form id="spotifyForm" onSubmit={handleSubmit}>
                <p> Let's create agenre tailored playlist with your liked music!  </p>
                <div className="formButton">
                    <TextField
                        name="spotifyUserId"
                        id="outlined-basic"
                        variant="outlined"
                        label="SpotifyId"
                        onChange={handleFormFieldChange}
                    />
                </div>
                <div className="formButton">
                    <TextField
                        name="genre"
                        label="Genre"
                        id="outlined-basic"
                        variant="outlined"
                        placeholder="spotifyid"
                        onChange={handleFormFieldChange}
                    />
                </div>
                <Button 
                    className="submitButton" 
                    variant="outlined" 
                    type="submit">
                    Submit
                </Button>
                
                </form>
                    <p> Don't know what genre playlist you want? Put your userId and let's find out what genres you listen to</p>
                    <Button 
                    name="queryGenres"
                    className="formButton" 
                    variant="outlined" 
                    onClick={genreQuery}
                    >
                    Find My Genres
                </Button>
                <ul>
                    {genreList.map((genre: string)=> 
                        <li key={genre}>{genre}</li>)}

                </ul>
                
                </div>
            )}
            
            {showSongRecommendations && (
                <form id="spotifyForm" onSubmit={handleSubmit}>
                <div className="container">
                <p> Give me a song and I'll give you some similiar recs! </p>
                <div className="formButton">
                    <TextField
                        name="spotifyUserId"
                        id="outlined-basic"
                        variant="outlined"
                        label="SpotifyId"
                        onChange={handleFormFieldChange}
                    />
                </div>
                <div className="formButton">
                    <TextField
                        name="quantityK"
                        label="Number of Playlists"
                        id="outlined-basic"
                        variant="outlined"
                        placeholder="spotifyid"
                        onChange={handleFormFieldChange}
                    />
                </div>
                <Button 
                    className="submitButton" 
                    variant="outlined" 
                    type="submit">
                    Submit
                </Button>
                </div>
                </form>
            )}
            

            
        </div>
    )
    
};

const rootElement = document.getElementById('root');
if (rootElement){
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App/>);
}
