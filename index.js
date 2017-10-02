'use strict';

// Import the interface to Tessel hardware
const tessel = require('tessel');
const climate = require('./climate/climate');
const audio = require('./audio/audio');

// Turn one of the LEDs on to start.
tessel.led[2].on();

// Blink!
setInterval(() => {
  tessel.led[2].toggle();
  tessel.led[3].toggle();
}, 100);

console.log("I'm blinking! (Press CTRL + C to stop)");

climate.on('ready', function () {
  console.log('Connected to climate module');

  // Loop forever
  setInterval(() => {
    climate.readTemperature('f', (err, temp) => {
      if (err) throw new Error(err);
      climate.readHumidity((err, humid) => {
        if (err) throw new Error(err);
        if (temp.toFixed(4) < 60) {
          audio.tooCold.play();
        }
        console.log('Degrees:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
      });
    });
  }, 300);

});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});
