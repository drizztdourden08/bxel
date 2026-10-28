/* @layer renderer-app @kind constants */
const OPTION_COMMAND = {
  set: 'options.set',
  reset: 'options.reset',
  resetAll: 'options.reset_all',
  focus: 'options.focus',
  open: 'options.open',
  pixelPerfect: 'brush.toggle_pixel_perfect',
  cycleTip: 'brush.cycle_tip',
  sizeDownBy: 'brush.size_down_by_four',
  sizeUpBy: 'brush.size_up_by_four',
  fillArea: 'fill.toggle_area',
  fillNeighbours: 'fill.toggle_neighbours',
  shapeKind: 'shape.set_kind',
  shapeFilled: 'shape.toggle_filled',
  selectShape: 'select.set_shape',
  selectMode: 'select.set_mode',
} as const;

const TOOL_COMMAND = {
  previous: 'tool.previous',
  palette: 'tool.palette',
  savePreset: 'tool.save_preset',
  applyPreset: 'tool.apply_preset',
  resetOptions: 'tool.reset_options',
  hideMember: 'tool.hide_member',
  cycleBack: (tool: string): string => `tool.cycle_back_${tool}`,
  quickPreset: (slot: number): string => `tool.apply_quick_preset_${slot}`,
} as const;

export { OPTION_COMMAND, TOOL_COMMAND };
