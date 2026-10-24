/* @layer renderer-app @kind constants */
const LAYER_TEXT = {
  locked: (name: string): string => `Layer ${name} is locked. Unlock it or choose another layer.`,
  hidden: (name: string): string => `Layer ${name} is hidden. Show it to draw on it.`,
  needUnlock: (name: string): string => `Layer ${name} is locked. Unlock it first.`,
  needShow: (name: string): string => `Layer ${name} is hidden. Show it first.`,
  lastLayer: 'A sprite keeps at least one layer.',
  bottom: 'Cannot merge down from the bottom layer.',
  noVisible: 'Show a layer first. Flatten copy joins the visible layers.',
  nameInvalid: 'A name has 1 to 64 characters you can print.',
  nameTaken: 'That name is already used. Choose another name.',
} as const;

const LAYER_LABEL = {
  add: 'New layer',
  remove: 'Delete layer',
  duplicate: 'Duplicate layer',
  merge: 'Merge layer down',
  flatten: 'Flatten copy',
  rename: 'Rename layer',
  visible: 'Show or hide layer',
  locked: 'Lock or unlock layer',
  move: 'Move layer',
} as const;

const LAYER_REF = 'layer';

const LAYER_STATE = { locked: 'locked', hidden: 'hidden' } as const;

export { LAYER_LABEL, LAYER_REF, LAYER_STATE, LAYER_TEXT };
