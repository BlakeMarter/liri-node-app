// LIRI Homework JS
// ****************

require("dotenv").config();

var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");

var action = process.argv[2];

// Creating switch statement to use in cammand line.
// -------------------------------------------------------------------------------------------------

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
// -------------------------------------------------------------------------------------------------

// // concert-this function-------------------------------------------------------------------------

function concertThis() {

  var artist = "";
  artist = process.argv.slice(3).join(" ");

  var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  axios
    .get(queryUrl)
    .then(function (response) {
      debugger;
      // console.log("Response: " + response);

      function capitalize_Words(str) {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
      }

      console.log("\n------------------------------Concert-This------------------------------\n" +
        "\nArtist/Band Name: " + capitalize_Words(artist) +
        "\nVenue Name: " + response.data[0].venue.name +
        "\nVenue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.country +
        "\nDate of the Event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") +
        "\n------------------------------------------------------------------------\n"
      );
    })
    .catch(function (error) {
      console.log(error);
    });
};

// // spotify-this-song function--------------------------------------------------------------------
function spotifyThis() {
  
  var search = process.argv.slice(3).join(" ");
  if (!search) {
    search = "The Sign";
  }

  spotify.search({ type: 'track', query: search }, function (err, response) {

    if (err) {
      return console.log('Error occurred: ' + err);
    } else {
      console.log("Search: " + search);

      // debugger;
      // console.log("Response: " + response);
      var spotSong = response.tracks.items[0];
      // console.log("spotSong: " + spotSong);

      console.log("\n---------------------------Spotify-this-song---------------------------\n" +
        "\nArtist/Band: " + spotSong.artists[0].name +
        "\nSong: " + spotSong.name +
        "\nPreview Song: " + spotSong.external_urls.spotify +
        "\nAlbum: " + spotSong.album.name + "\n" +
        "\n-----------------------------------------------------------------------\n");
    }
  });

};


// movie-this function------------------------------------------------------------------------------
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

// do-this function---------------------------------------------------------------------------------
// function doThis() {

// };

