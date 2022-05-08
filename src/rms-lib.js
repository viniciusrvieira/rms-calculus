const mathjs = require('mathjs');
const fft = require('fft-js').fft;
const ifft = require('fft-js').ifft;

module.exports = {
  complexJsonArrayToMatrix(complex_json_array) {
    let aux = [];
    let output = [];

    for (i = 0; i < complex_json_array.length; i++) {
      aux = [];
      aux.push(complex_json_array[i].re);
      aux.push(complex_json_array[i].im);
      output.push(aux);
    }

    return output;
  },
  getFrequencies: function getFrequencies(fft_matrix, fs) {
    const N = fft_matrix.length;
    let frequencies = [];

    for (i = 0; i < N / 2; i++) {
      frequencies.push((fs * i) / N);
    }

    return frequencies;
  },
  getMagnitudes: function getMagnitudes(fft_matrix) {
    const N = fft_matrix.length;
    let magnitudes = [];

    for (i = 0; i < N / 2; i++) {
      magnitudes.push(Math.sqrt(fft_matrix[i][0] ** 2 + fft_matrix[i][1] ** 2)); // sqrt(real_part^2 + imag_part^2)
    }

    return magnitudes;
  },
  getRms: function getRms(signal, fs, zero_padding_freq = 1 / (2 * Math.PI)) {
    let removed_dc_signal = this.meanSubtraction(signal.magnitude); // remove dc component
    let windowned_signal = this.hannsWindow(removed_dc_signal); // filter to make signal periodic
    let fft_values = fft(windowned_signal); // to freq domain
    let freq_integrated_signal = this.integrate(
      fft_values,
      fs,
      zero_padding_freq
    ); // integrate signal and zero padding
    let freq_integrated_signal_matrix = this.complexJsonArrayToMatrix(
      freq_integrated_signal
    ); // json to matrix
    let time_integrated_signal = this.ifftCalculus(
      freq_integrated_signal_matrix
    ); // to time domain

    return (rms = this.rmsCalculus(time_integrated_signal)); // get rms
  },
  hannsWindow: function hannsWindow(sampled_data, window_size = 50) {
    let filtered_data = [];
    let weight_array = [];

    const M = sampled_data.length;

    for (i = 0; i < M; i++) {
      filtered_data.push(sampled_data[i]);
    }
    for (i = 0; i < window_size; i++) {
      weight_array.push(0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (M - 1)));
      filtered_data[i] = filtered_data[i] * weight_array[i];
      filtered_data[filtered_data.length - (i + 1)] =
        filtered_data[filtered_data.length - (i + 1)] * weight_array[i];
    }
    return filtered_data;
  },
  ifftCalculus: function ifftCalculus(fft) {
    let ifft_result = ifft(fft);
    let output = [];

    for (i = 0; i < ifft_result.length; i++) {
      output.push(ifft_result[i][0]);
    }
    return output;
  },
  integrate: function integrate(fft, fs, zero_padding_freq) {
    let velocity = [];
    let omega = 0;
    let frequencies = this.getFrequencies(fft, fs);

    for (i = 0; i < fft.length; i++) {
      omega = 2 * Math.PI * frequencies[i];
      if (frequencies[i] >= zero_padding_freq) {
        velocity.push(
          mathjs.divide(mathjs.complex(fft[i][0], fft[i][1]), omega)
        );
      } else {
        velocity.push(mathjs.complex(0, 0)); // zero padding for omega < 1
      }
    }

    return velocity;
  },
  meanSubtraction: function meanSubtraction(array) {
    const N = array.length;
    let final_array = [];
    let total = array.reduce((a, b) => a + b, 0);
    let mean = total / N;

    for (i in array) {
      final_array.push(array[i] - mean);
    }

    return final_array;
  },
  rmsCalculus: function rmsCalculus(array) {
    const N = array.length;
    let sum = array.reduce((a, b) => a + b ** 2, 0);

    return (rms = Math.sqrt(sum / N));
  },
};
