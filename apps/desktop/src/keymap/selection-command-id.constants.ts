/* @layer renderer-app @kind constants */
const SELECTION_COMMAND_ID = {
  selectAll: 'selection.select_all',
  clear: 'selection.clear',
  invert: 'selection.invert',
  expand: 'selection.expand',
  shrink: 'selection.shrink',
  copy: 'selection.copy',
  cut: 'selection.cut',
  paste: 'selection.paste',
  delete: 'selection.delete',
  apply: 'preview.apply',
  cancel: 'preview.cancel',
  flipHorizontal: 'transform.flip_horizontal',
  flipVertical: 'transform.flip_vertical',
  turnClockwise: 'transform.turn_clockwise',
  turnCounterClockwise: 'transform.turn_counter_clockwise',
  rotate: 'transform.rotate',
  scale: 'transform.scale',
} as const;

export { SELECTION_COMMAND_ID };
