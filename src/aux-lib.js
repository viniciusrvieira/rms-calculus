module.exports = {
  addMicroseconds: function addMicroseconds(data) {
    let date = new Date(data.time);
    let datetime = date.toISOString().slice(0, -4);
    let microseconds = String(data.microseconds).padStart(6, '0');

    data.time = datetime + microseconds + 'Z';

    return data.time;
  },
  cosArray: function cosArray(frequency, time, offset = 0) {
    let cos_array = [];

    for (i = 0; i < time.length; i++) {
      cos_array.push(offset + Math.cos(2 * Math.PI * frequency * time[i]));
    }
    return cos_array;
  },
  rawAccToFloatConversion: function rawAccToFloatConversion(
    raw_acc,
    acc_scale = 2
  ) {
    const MAX_16BITS_SIGNED_INT = 32767;
    let bit_shift_16bits = 16 >> acc_scale;
    let acc_resolution = bit_shift_16bits / MAX_16BITS_SIGNED_INT;
    let float_acc = raw_acc * acc_resolution;

    return float_acc;
  },
  convertCsvToJson: function convertCsvToJson(csv_data) {
    let acc_x = [];
    let acc_y = [];
    let acc_z = [];
    let time = [];
    let datetime = [];

    for (let i = 1; i < csv_data.length; i++) {
      acc_x.push(parseFloat(this.rawAccToFloatConversion(csv_data[i][0])));
      acc_y.push(parseFloat(this.rawAccToFloatConversion(csv_data[i][1])));
      acc_z.push(parseFloat(this.rawAccToFloatConversion(csv_data[i][2])));
      datetime.push(
        parseFloat(
          this.addMicroseconds({
            time: csv_data[i][3],
            microseconds: csv_data[i][4],
          })
        )
      );
      time.push(parseFloat(csv_data[i][4]));
    }
    return {
      acc_x: acc_x,
      acc_y: acc_y,
      acc_z: acc_z,
      datetime: datetime,
      time: time,
    };
  },
  range: function range(start, end, step = 1) {
    try {
      let result = [];

      for (i = start; i < end; i += step) {
        result.push(i);
      }

      return result;
    } catch (e) {
      console.log('Invalid input!');
    }
  },
};
