const express = require('express'),
    mongoose = require('mongoose'),
    GoogleImages = require('node-google-image-search'),
    recordModel = require('./schema'),
    path = require('path');


const port = process.env.PORT || 3000;
var connect = process.env.MONGODB_URI;

mongoose.connect(connect);

var app = express();

app.get('/', function(req, res){
  //send standart html as homepage
  res.sendFile('./index.html', {root: __dirname});
});

app.get('/search/*', function(req, res){
  //get the img anf offset
  var img = req.params[0];
  var offset = req.query.offset || 5;

  //get time
  var t = new Date();
  t = t.toUTCString();

  //create a new record and savy do db
  var record = new recordModel({
    term: img,
    time: t
  });
  record.save();

  //get resoults from google, format them
  //then send them as respons
  var results = GoogleImages(img, callback, 0, offset);
  var resObj = [];
  function callback(results) {

      for ( let i in results)
      {
          resObj.push({
            link: results[i].link,
            snippet: results[i].snippet,
            thumbnailLink: results[i].image.thumbnailLink,
            contextLink: results[i].image.contextLink
          });
      };
      res.send(resObj);
  }
});



app.get('/latest', function(req, res){

  //select last 10 resoults, formant then and disply to user.
  recordModel.find({}).sort({"time": -1}).limit(10).exec(function(err, results){
    var resObj = [];
    for (let i in results){
      resObj.push({
        term: results[i].term,
        time: results[i].time
      })
    }
    res.send(resObj);
  });

});

app.listen(port);
