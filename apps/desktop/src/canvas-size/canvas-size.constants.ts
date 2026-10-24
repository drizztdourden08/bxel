/* @layer renderer-app @kind constants */
const CANVAS_SIZE_LABEL = {
  crop: 'Crop sprite to selection',
} as const;

const CANVAS_SIZE_TEXT = {
  noSelection: 'Select an area first, then crop to it.',
  nothingToTrim: 'The sprite already touches every edge. There is nothing to trim.',
} as const;

export { CANVAS_SIZE_LABEL, CANVAS_SIZE_TEXT };
