// LIRI Homework JS
// -------------------------------------------------------------------------------------------------
require("dotenv").config();

var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");

// -------------------------------------------------------------------------------------------------
// Creating input function to use in cammand line.
// -------------------------------------------------------------------------------------------------
function input(action, param) {
  var printInput;

  // Checking for users input
  switch (action) {
    case "concert-this":
      concertThis(param);
      break;

    case "spotify-this-song":
      spotifyThis(param);
      break;

    case "movie-this":
      movieThis(param);
      break;

    case "do-what-it-says":
      doThis();
      break;
  }

  // checks again for verification
  if (param === undefined) {
    printInput = `${action}`

  } else {
    printInput = `${action} ${param}`
  }

  // formats the printInput
  printInput = `\n***********************************************************************\n` +
    `${printInput}` +
    `\n***********************************************************************\n`
  // displays user input to terminal/bash and writes it to log.txt 
  saveData(printInput);
}

// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
// concert-this function
// -------------------------------------------------------------------------------------------------

function concertThis(param) {

  param = process.argv.slice(3).join(" ");

  var queryUrl = "https://rest.bandsintown.com/artists/" + param + "/events?app_id=codingbootcamp";

  axios
    .get(queryUrl)
    .then(function (response) {
      // console.log("Response: " + response);

      function capitalize_Words(str) {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
      }

      var printConcert = "\n-----------------------------Concert-This------------------------------\n" +
        "\nArtist/Band Name: " + capitalize_Words(param) + "\n" +
        "\nVenue Name: " + response.data[0].venue.name + "\n" +
        "\nVenue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.country + "\n" +
        "\nDate of the Event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\n" +
        "\n-----------------------------------------------------------------------\n" +
        "\n***********************************************************************\n";
      saveData(printConcert);


    })
    .catch(function (error) {
      console.log(error);
    });
};
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
// // spotify-this-song function
// -------------------------------------------------------------------------------------------------

function spotifyThis(param) {

  param = process.argv.slice(3).join(" ");

  if (!param) {
    param = "The Sign";
  }

  spotify.search({ type: 'track', query: param }, function (err, response) {

    if (err) {
      return console.log('Error occurred: ' + err);
    } else {
      // console.log("Search: " + search);

      var spotSong = response.tracks.items[0];
      // console.log("spotSong: " + spotSong);

      var printSong = "\n---------------------------Spotify-this-song---------------------------\n" +
        "\nArtist/Band: " + spotSong.artists[0].name + "\n" +
        "\nSong: " + spotSong.name + "\n" +
        "\nPreview Song: " + spotSong.external_urls.spotify + "\n" +
        "\nAlbum: " + spotSong.album.name + "\n" +
        "\n-----------------------------------------------------------------------\n" +
        "\n***********************************************************************\n";
      saveData(printSong);
    }
  });
};
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
// movie-this function
// -------------------------------------------------------------------------------------------------

function movieThis(param) {

  var nodeArgs = process.argv;
  param = "";

  if (!param) {
    param = "Mr. Nobody";
  } 


  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      param = param + "+" + nodeArgs[i];
    }
    else {
      param += nodeArgs[i];
    }
  }

 

  var queryUrl = "http://www.omdbapi.com/?t=" + param + "&y=&plot=short&apikey=trilogy";

  axios
    .get(queryUrl)
    .then(function (response) {
      function rottenTomatoes() {
        var rottenTomatoes;
        if (response.data.Ratings[1] === undefined) {
          rottenTomatoes = "N/A"
          return "\nRotten Tomatoes: " + rottenTomatoes + "\n";
        } else {
          rottenTomatoes = response.data.Ratings[1].Value;
          return "\nRotten Tomatoes rating: " + response.data.Ratings[1].Value + "\n";
        };
      }
      var printMovie = "\n------------------------------Movie-This-------------------------------\n" +
        "\nTitle: " + response.data.Title + "\n" +
        "\nRelease Year: " + response.data.Year + "\n" +
        "\nIMDB rating: " + response.data.imdbRating + "\n" +
        rottenTomatoes() +
        "\nProduced in: " + response.data.Country + "\n" +
        "\nLanguage " + response.data.Language + "\n" +
        "\nActors: " + response.data.Actors + "\n" +
        "\nPlot: " + response.data.Plot + "\n" +
        "\n-----------------------------------------------------------------------\n" +
        "\n***********************************************************************\n";
      saveData(printMovie);
    })
  
};
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
// do-what-it-says function
// -------------------------------------------------------------------------------------------------

function doThis() {

  fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var data = data.split(',')

    input(data[0], data[1]);
  })
}

// -------------------------------------------------------------------------------------------------
// printData function
// -------------------------------------------------------------------------------------------------

function saveData(log) {
  fs.appendFile("log.txt", log, function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(log);
    }
  })
}


// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
// Calling functions
// -------------------------------------------------------------------------------------------------
input(process.argv[2], process.argv.slice(3).join(" "));