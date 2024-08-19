//general statements
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var client_id = 'd6b3c95879404224b0d0fd6b5c07c07b';
var client_secret = 'e0d3a7fd225e4aefb886c9ffcb6119f3';
var request = require('request');

// authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

//declaring names and emotions classes
class title_artist {
  constructor(title, writer) {
    this.title = title;
    this.writer = writer;
  }
}

class emotions_numb {
  constructor(danceability, energy, acousticness, liveness, valence) {
    this.danceability = danceability;
    this.energy = energy;
    this.acousticness = acousticness;
    this.liveness = liveness;
    this.valence = valence;
  }
}

class finalval{
  constructor(id, title){
    this.id = id; 
    this.title = title;
  }
}

//declaring containers
array_title_artist = []
array_emotions_numb = [];
array_feelings = [];
array_uid = [];
arry_categorize = [];

sad_songs = [];
dance_songs = [];
happy_songs = [];
chill_songs = [];

const requestcomplete = new Promise((resolve, reject) => { 
  const loading = "complete"; 
  request.post(authOptions, function(error, response, body) {
    var access;
    if (!error && response.statusCode === 200) {
      access = body.access_token
      console.log("Access_token: " + access);
    }

    const fs = require('fs');
    const readline = require('readline');
    
    const file = readline.createInterface({
      input: fs.createReadStream('/Users/riyachakravarty/Desktop/xcode_files/ProjS22/playlistgen/SampleMusic.csv'),
      output: process.stdout,
      terminal: false
  });


  file.on('line', (line) => { 
    split_line = line.split(',');
    new_tile_artist = new title_artist(split_line[1], split_line[0]);
    array_title_artist.push(new_tile_artist);
    array_feelings.push(split_line[2]);
    array_uid.push(split_line[3])

    // console.log("EMOTION: "+ array_feelings[array_feelings.length - 1]);
    // console.log("Title: " + array_title_artist[array_title_artist.length - 1].title);
    // console.log("Artist: " + array_title_artist[array_title_artist.length - 1].writer);
    // console.log("URI: " + array_uid[array_uid.length - 1]);

    // getting numbers
    var url = "https://api.spotify.com/v1/audio-features/" + array_uid[array_uid.length - 1];
    var songtitle = array_title_artist[array_title_artist.length - 1].title;
    var howifeel = array_feelings[array_feelings.length - 1];
    var songid = array_uid[array_uid.length - 1];

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url); 

    var count = 0;
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + access);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          //console.log(xhr.status);
          //console.log(xhr.responseText);
          data = JSON.parse(xhr.responseText);
          new_emotions = new emotions_numb(data.danceability, data.energy, data.liveness, data.valence);
          console.log(songtitle + "," + howifeel + "," + data.danceability + "," + data.energy + "," + data.liveness + "," + data.valence);
          array_emotions_numb.push(new_emotions);
          var sad = 0;
          var happy = 0;
          var dance = 0;
          var chill = 0;
          if (data.energy <= 0.6){
            sad = sad + 1;
          }
          if (data.energy >= 0.7){
            happy = happy + 1;
          }
          if (data.energy > 0.6 && data.energy < 0.68){
            chill = chill + 1; 
          }
          if(data.energy >= 0.68 && data.energy <= 0.72){
            dance = dance + 1; 
          }

          var feeling = Math.max(sad, happy, chill, dance);
          new_entry = new finalval (songtitle, songid);
          if (sad == feeling){
            sad_songs.push(new_entry);
           // console.log("sad");
          }
          else if (happy == feeling){
            happy_songs.push(new_entry);
            //console.log("happy");
          }
          else if (chill == feeling){
            chill_songs.push(new_entry);
           // console.log("chill");
          }
          else if (dance == feeling){
            dance_songs.push(new_entry);
            // console.log("dance");
          }
      }};
    xhr.send();
  });//line by line reading

  });//request
})//promise



//All that's left is to take the file (from spotify), retrieve the URIs 
//Also if you want to create playlists from these songs 