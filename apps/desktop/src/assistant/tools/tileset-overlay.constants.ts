/* @layer renderer-app @kind constants */
const OVERLAY_COLOURS: readonly (readonly [number, number, number])[] = [
  [255, 80, 80],
  [80, 160, 255],
  [255, 200, 60],
  [90, 210, 120],
  [200, 120, 255],
];

const OVERLAY_ALPHA = 0.45;

const CHANNELS = 4;

const GAP_COLOUR: readonly [number, number, number, number] = [0, 0, 0, 40];

export { CHANNELS, GAP_COLOUR, OVERLAY_ALPHA, OVERLAY_COLOURS };
