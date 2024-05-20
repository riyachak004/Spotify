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
read_from_file = [];
array_uid = [];

sad_songs = [];
dance_songs = [];
happy_songs = [];
chill_songs = [];

  request.post(authOptions, function(error, response, body) {
    var access;
    if (!error && response.statusCode === 200) {
      access = body.access_token
      //console.log("Access_token: " + access);
    }

    const fs = require('fs');
    const readline = require('readline');
    
    const file = readline.createInterface({
      input: fs.createReadStream('/Users/riyachakravarty/Desktop/xcode_files/ProjS22/playlistgen/YourLibrary2.json'),
      output: process.stdout,
      terminal: false
  });


  file.on('line', (line) => { 

    split_line = line.split(':');
 
    if (split_line[0] == '      "track"'){
      title = split_line[1]; 
      title = title.substring(2, title.length - 2);

    }
    if (split_line[0] == '      "uri"'){
      id = split_line[3];
      id = id.substring(0, id.length - 1);
      val = new finalval(id, title);
      read_from_file.push(val);

      // getting numbers
      console.log("ID: " + read_from_file[read_from_file.length - 1].id);
      
      var url = "https://api.spotify.com/v1/audio-features/" + read_from_file[read_from_file.length - 1].id;

      new_entry = new finalval (read_from_file[read_from_file.length - 1].id, read_from_file[read_from_file.length - 1].title);

      var xhr = new XMLHttpRequest();
      xhr.open("GET", url); 

      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + access);
      console.log("here")
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);
            data = JSON.parse(xhr.responseText);
          console.log(data.id + "," + data.danceability + "," + data.energy + "," + data.liveness + "," + data.valence);
            //array_emotions_numb.push(new_emotions);
            var sad = 0;
            var happy = 0;
            var dance = 0;
            var chill = 0;
            
            var feeling = Math.max(sad, happy, chill, dance);
            
            //console.log("input ID: " + data.id);
            if (sad == feeling){
              sad_songs.push(data.id);
              //console.log("sad");
            }
            else if (happy == feeling){
              happy_songs.push(data.id);
              //console.log("happy");
            }
            else if (chill == feeling){
              chill_songs.push(data.id);
              //console.log("chill");
            }
            else if (dance == feeling){
              dance_songs.push(data.id);
              //console.log("dance");
            }
        }};
      xhr.send();
      }
  });//line by line reading

});


setTimeout(function() {FetchData();}, 3000);
function FetchData() {
  console.log("SAD SIZE: " + sad_songs.length);
  console.log("DANCE SIZE: " + dance_songs.length);
  console.log("HAPPY SIZE: " + happy_songs.length);
  console.log("CHILL SIZE: " + chill_songs.length);
  // var sum = sad_songs.length + dance_songs.length + happy_songs.length + chill_songs.length;
  // console.log("total songs: " + sum)

  // for (const sad of chill_songs){
  //   process.stdout.write("spotify:track:" + sad + ",");
  // }

}



//having an issue with reading the numbers