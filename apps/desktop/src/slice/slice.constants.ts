/* @layer renderer-app @kind constants */
const SLICE_LABEL = {
  add: 'Add slice',
  update: 'Edit slice',
  remove: 'Delete slice',
  distribute: 'Distribute slices',
  needThree: 'Add three or more slices to space them out.',
  needSelection: 'Select an area first, then make a slice from it.',
  needSlice: 'Pick a slice first, then turn it into a selection.',
} as const;

const SLICE_HANDLE_REACH = 4;

const DOUBLE_CLICK_MS = 400;

export { DOUBLE_CLICK_MS, SLICE_HANDLE_REACH, SLICE_LABEL };
