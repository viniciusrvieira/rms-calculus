const rmsLib = require("../src/rms-lib.js");
const auxLib = require("../src/aux-lib.js");

const FREQUENCY = 5; // Frequency in Hz
const OFFSET = 2; // Voltage OFFSET
const MAX_TIME = 2; // Max sampled time
const FS = 1024; // Sample rate
const ZERO_PADDING_FREQ = 3; // in Hz

/* Generate cosinusoidal signal */
let time = auxLib.range(0, MAX_TIME, 1 / FS); // Time array
let magnitude = auxLib.cosArray(FREQUENCY, time, OFFSET); // Cos array

let signal = { magnitude: magnitude, time: time };

let rms = rmsLib.getRms(signal, FS, ZERO_PADDING_FREQ);

console.log(`rms: ${rms}`);
