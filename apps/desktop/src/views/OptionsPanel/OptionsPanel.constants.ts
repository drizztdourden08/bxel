/* @layer renderer-app @kind constants */
const OPTIONS_PANEL_TEXT = {
  region: 'Tool options',
  zone: 'bxel.options-panel',
  menuLabel: 'Tool options menu',
  focusBar: 'Go to the options bar',
  savePreset: 'Save as preset',
  none: 'No tool here',
  noneHint: 'Open or create an asset to see the options of a tool.',
  sheet: 'Pick a sprite to paint it',
  noOptions: 'This tool has nothing to set.',
  presets: 'Presets',
  advanced: 'More options',
  resetTool: 'Reset tool',
  resetAll: 'Reset all tools',
  custom: 'Custom',
  groups: {
    brush: 'Brush',
    area: 'Fill',
    shape: 'Shape',
    select: 'Selection',
    turn: 'Tile turn',
    terrain: 'Terrain',
    actions: 'Actions',
    move: 'Move',
  },
} as const;

const BRUSH_TOOLS: readonly string[] = ['pencil', 'eraser', 'shade', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon'];

export { BRUSH_TOOLS, OPTIONS_PANEL_TEXT };
