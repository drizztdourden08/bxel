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
  apply: 'Apply',
  cancel: 'Cancel',
  invalid: 'The slice must have a free name, stay inside the sprite and keep its pivot and centre inside it.',
} as const;

export { SLICE_DIALOG_TEXT };
