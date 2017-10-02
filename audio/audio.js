// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
- Play audio from an amusing scene between Luke Skywalker, R2-D2 and Yoda
- When the audio reaches the end, play it again from the beginning.
*********************************************/

const path = require('path');
const av = require('tessel-av');

const perfectTempFile = path.join(__dirname, 'perfecttemp.mp3');
const perfectTemp = new av.Player(perfectTempFile);
const tooColdFile = path.join(__dirname, 'mrbigglesworth.mp3');
const tooCold = new av.Player(tooColdFile);

module.exports = {
  perfectTemp: perfectTemp,
  tooCold: tooCold,
};
