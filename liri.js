// LIRI Homework JS

require("dotenv").config();

var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");


var action = process.argv[2];
// console.log(process.argv.slice(2));


debugger;
// Creating switch statement to use in cammand line.
switch (action) {
  case "concert-this":
    concertThis();
    break;

  case "spotify-this-song":
    spotifyThis();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    doThis();
    break;
}

// Begin creating functions.
// --------------------------------------------------------------------------------------

// // concert-this function
function concertThis(artist) {

  // var nodeArgs = process.argv;
  var artist = "";
  artist = process.argv.slice(3).join(" ");

  var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  axios
    .get(queryUrl)
    .then(function (response) {

      for (var i = 0; i < 1; i++) {
        let venueRes = "--------------------------------------------------------------------" +
          "\nVenue Name: " + response.data[i].venue.name +
          "\nVenue Location: " + response.data[i].venue.city +
          "\nDate of the Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY") +
          "\n--------------------------------------------------------------------";
        console.log(venueRes);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

// // spotify-this-song function
function spotifyThis() {
  var search = process.argv.slice(3).join(" ");
  if (!search) {
    search = "The Sign";
  }

  spotify.search({ type: 'track', query: search }, function (err, response) {

    if (err) {
      return console.log('Error occurred: ' + err);
    } else {
      var track = response.tracks.items;
      console.log(track);

      console.log("\n-----------------------------------------------------------\n" +
        "\nArtist/Band:" + track.artists[0].name +
        "\nSong: " + track.name +
        "\nPreview Song: " + track.external_urls.spotify +
        "\nAlbum: " + track.album.name +
        "\n-----------------------------------------------------------\n");
    }
  });

};


// movie-this function
function movieThis(movieName) {

  var nodeArgs = process.argv;
  var movieName = "";

  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      movieName = movieName + "+" + nodeArgs[i];
    }
    else {
      movieName += nodeArgs[i];
    }
  }

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  axios
    .get(queryUrl)
    .then(function (response) {
      console.log("\n-----------------------------------------------------------\n" +
        "\nTitle: " + response.data.Title +
        "\nRelease Year: " + response.data.Year +
        "\nIMDB rating: " + response.data.imdbRating);

      var rottenTomatoes;
      if (response.data.Ratings[1] === undefined) {
        rottenTomatoes = "N/A"
        console.log("Rotten Tomatoes: " + rottenTomatoes);
      } else {
        rottenTomatoes = response.data.Ratings[1].Value;
        console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);
      }

      console.log("Produced in " + response.data.Country +
        "\nThis movie is in " + response.data.Language +
        "\nActors: " + response.data.Actors +
        "\nPlot: " + response.data.Plot +
        "\n-----------------------------------------------------------\n");
    })
};


// function doThis() {

// };

