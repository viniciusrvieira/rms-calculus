const auxLib = require('../src/aux-lib');
const rmsLib = require('../src/rms-lib.js');
const csv = require('node-csv').createParser();
const FILE_DIR = 'csv/data.csv';

/* Generate DeltaTimeArray */
function getDeltaTimeArray(time_array) {
  let delta_time_array = [];

  for (i = 1; i < time_array.length; i++) {
    delta_time_array.push(time_array[i] - time_array[i - 1]);
  }

  return delta_time_array;
}

csv.parseFile(FILE_DIR, function (err, data) {
  let jsonData = auxLib.convertCsvToJson(data);
  let delta_time_microsec_array = getDeltaTimeArray(jsonData.time);
  let delta_time_microsec_mean =
    delta_time_microsec_array.reduce((a, b) => {
      return a + b;
    }, 0) / delta_time_microsec_array.length;
  let delta_time_sec_mean = delta_time_microsec_mean * 10 ** -6;
  let fs_mean = 1 / delta_time_sec_mean;
  console.time('Time to calc rms');
  console.log(
    `acc_x rms: ${rmsLib.getRms(
      { magnitude: jsonData.acc_x, time: jsonData.datetime },
      fs_mean
    )}`
  );
  console.log(
    `acc_y rms: ${rmsLib.getRms(
      { magnitude: jsonData.acc_y, time: jsonData.datetime },
      fs_mean
    )}`
  );
  console.log(
    `acc_z rms: ${rmsLib.getRms(
      { magnitude: jsonData.acc_z, time: jsonData.datetime },
      fs_mean
    )}`
  );
  console.timeEnd('Time to calc rms');
});
