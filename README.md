# RMS Calculus

A library of functions to convert acceleration to velocity and do the RMS calculus.

## Table with calculus step

| Step | Description                         |
| ---- | ----------------------------------- |
| 0    | Remove dc signal                    |
| 1    | Filter signal with Hann's window    |
| 2    | FFT                                 |
| 3    | Integrate signal to obtain velocity |
| 4    | iFFT                                |
| 5    | RMS calculus                        |
