/* @layer renderer-app @kind constants */
const PASTE_CHOICE_TEXT = {
  title: 'The copied pixels are larger than this sprite',
  message: 'Choose how to paste them.',
  crop: 'Crop to the sprite',
  expand: 'Expand the canvas',
  sprite: 'Paste as new sprite',
  cancel: 'Cancel',
} as const;

export { PASTE_CHOICE_TEXT };
