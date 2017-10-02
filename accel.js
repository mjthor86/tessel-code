// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

const tessel = require('tessel');
const accel = require('accel-mma84').use(tessel.port.B);

accel.on('ready', () => {
  accel.on('data', xyz => {
    xyz.forEach(plane => {
      if (Math.abs(plane.toFixed(2)) > 1.5) {
        audio.impact.play();
        // tweet
      }
    });
    // console.log('x:', xyz[0].toFixed(2),
    //   'y:', xyz[1].toFixed(2),
    //   'z:', xyz[2].toFixed(2));
  });
});

accel.on('error', function(err){
  console.log('Error:', err);
});

module.exports = accel;
