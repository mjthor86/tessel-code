'use strict';

// Import the interface to Tessel hardware
const tessel = require('tessel');
const climate = require('./climate/climate');
const audio = require('./audio/audio');
const twit = require('./tessel-tweet/')

// Turn one of the LEDs on to start.
tessel.led[2].on();

// Blink!
setInterval(() => {
  tessel.led[2].toggle();
  tessel.led[3].toggle();
}, 100);

var hotBool = false;
var coldBool = false;
var normalBool = false;
var runTweets = false;
console.log("I'm blinking! (Press CTRL + C to stop)");

climate.on('ready', function () {
  console.log('Connected to climate module');

  // Loop forever
  setInterval(() => {
    if(runTweets === false){
      response();
      runTweets = true;
    }
    climate.readTemperature('f', (err, temp) => {
      if (err) throw new Error(err);
      climate.readHumidity((err, humid) => {
        if (err) throw new Error(err);
        if (temp.toFixed(4) < 75 && coldBool === false) {
          tooCold(temp.toFixed(4));
          coldBool = true;
        } else if (temp.toFixed(4) > 75 && temp.toFixed(4) < 82 && normalBool === false) {
          normal(temp.toFixed(4));
          normalBool = true;
        } else if (82 < temp.toFixed(4) && hotBool === false) {
          tooHot(temp.toFixed(4));
          hotBool = true;
        }
        console.log('Degrees:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
      });
    });
  }, 300);

});

function tooCold(temp) {
  audio.tooCold.play();
  normalBool = false;
  var coldTweet = 'Hello ' + twitterHandle + '. It is ' + temp + ' degrees in here. Buuurrrrrrrr!';
  twit.post('statuses/update', { status: coldTweet });
}

function tooHot(temp) {
  audio.hotInHere.play();
  normalBool = false;
  var hotTweet = 'Hello ' + twitterHandle + '. It is ' + temp + ' degrees in here. Please cool it down!';
  twit.post('statuses/update', { status: hotTweet });
}

function normal(temp) {
  audio.perfectTemp.play();
  hotBool = false;
  coldBool = false;
  var normalTweet = 'Hello ' + twitterHandle + '. It is ' + temp + ' degrees in here. Perfect!!';
  twit.post('statuses/update', { status: normalTweet });

}

function currentHumidity(humidity) {
  var humidityTweet = 'Hello ' + twitterHandle + '. The current humidity is ' + humidity + '!!';
}

var twitterHandle = '@packmon_tessel';
// The status to tweet

function response() {
  twit.get('statuses/user_timeline.json?screen_name=saksamit&count=2', function (error, tweets, response) {
    //if (error) throw error;
    console.log('here are the tweets', tweets);  // The favorites. 
    //console.log('here is the response', response);  // Raw response object. 
  })
};

climate.on('error', function (err) {
  console.log('error connecting module', err);
});
