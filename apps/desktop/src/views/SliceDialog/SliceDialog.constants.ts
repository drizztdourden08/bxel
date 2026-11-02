/* @layer renderer-app @kind constants */
const SLICE_DIALOG_TEXT = {
  title: 'Slice properties',
  name: 'Name',
  x: 'X',
  y: 'Y',
  width: 'Width',
  height: 'Height',
  pivot: 'Pivot',
  pivotOn: 'Has a pivot',
  pivotCustom: 'Custom pivot',
  pivotX: 'Pivot X',
  pivotY: 'Pivot Y',
  centre: '9-slice centre',
  centreOn: 'Has a 9-slice centre',
  centreHint: 'The centre sits inside the slice. Its position counts from the slice corner.',
  colour: 'Outline colour',
  colourOn: 'Own outline colour',
  colourHint: 'Draws this slice in its own colour on the canvas. Off uses the default.',
  apply: 'Apply',
  cancel: 'Cancel',
  invalid: 'The slice must have a free name, stay inside the sprite and keep its pivot and centre inside it.',
} as const;

const SLICE_COLOUR_START = '#3b82f6';

export { SLICE_COLOUR_START, SLICE_DIALOG_TEXT };
