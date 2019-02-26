var inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const junk = require('junk');
const axios = require('axios');
const uuidv4 = require('uuid');
var AWS = require('aws-sdk');
var db = new AWS.DynamoDB();
var s3 = new AWS.S3();

const askForGenreName = async () => {
  return inquirer
  .prompt([{
    type: 'input',
    name: 'genre',
    message: 'Enter genre:',
  }])
  .then(answers => {
    return answers.genre
  });
};

const askForArtistName = async () => {
  return inquirer
  .prompt([{
    type: 'input',
    name: 'artist',
    message: 'Enter artist:',
  }])
  .then(answers => {
    return answers.artist
  });
};

const askForAlbumName = async () => {
  return inquirer
  .prompt([{
    type: 'input',
    name: 'album',
    message: 'Enter album:',
  }])
  .then(answers => {
    return answers.album
  });
};

const askForSongFileAndName = async() => {
  return inquirer
  .prompt([
    {
      type: 'input',
      name: 'filePath',
      message: 'Enter file path to song:'
    },
    {
      type: 'input',
      name: 'name',
      message: 'Enter name of song:'
    }
  ])
  .then(answers => {
    return { path: answers.filePath, name: answers.name }
  });
};

const uploadSong = async(genre, artist, album, song) => {
  console.log('reading song...');
  fs.readFile(song.path, function(err, data) {
    if (err) throw err;

    console.log('uploading song...');
    s3.upload({
      Key: song.name + '.mp3',
      Bucket: 'songs-1241513514',
      Body: data,
      ACL: 'public-read'
    }, function (err, data) {
      if (err) throw err;
      console.log(data)
      
      db.putItem({
        TableName: 'music',
        Item: {
          'genre': {
            S: genre
          },
          'artist_album_song': {
            S: artist + '_' + album + '_' + song.name
          },
          artist: {
            S: artist
          },
          album: {
            S: album
          },
          song: {
            S: song.name
          },
          url: {
            S: data.Location
          }
        }
      }, function (err, data) {
        if (err) throw err;
        console.log('song uploaded!');
      });
    });
  });
};

const run = async() => {
    const genre = await askForGenreName();
    const artist = await askForArtistName();
    const album = await askForAlbumName();
    const song = await askForSongFileAndName();
    if (genre && artist && album && song) {
      await uploadSong(genre, artist, album, song);
    }
};

run();