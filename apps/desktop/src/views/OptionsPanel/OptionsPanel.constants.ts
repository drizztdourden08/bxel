/* @layer renderer-app @kind constants */
const OPTIONS_PANEL_TEXT = {
  region: 'Tool options',
  zone: 'bxel.options-panel',
  menuLabel: 'Tool options menu',
  focusBar: 'Go to the options bar',
  savePreset: 'Save as preset',
  popOut: 'Pop out',
  dock: 'Dock',
  none: 'No tool here',
  noneHint: 'Open or create an asset to see the options of a tool.',
  sheet: 'Pick a sprite to paint it',
  noOptions: 'This tool has nothing to set.',
  presets: 'Presets',
  advanced: 'More options',
  resetTool: 'Reset tool',
  resetAll: 'Reset all tools',
  custom: 'Custom',
  library: {
    nameField: 'Name',
    size: (width: number, height: number): string => `${width} by ${height} pixels`,
    inUse: 'In use',
    use: 'Use',
    rename: 'Rename',
    remove: 'Delete',
    confirmRemove: 'Click again to delete',
    brush: { heading: 'Saved brushes', empty: 'No saved brushes. Select pixels and make a brush from them.', make: 'New brush from selection' },
    pattern: { heading: 'Saved dither patterns', empty: 'No saved patterns. Select pixels and make a pattern from them.', make: 'New pattern from selection' },
  },
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

const LIBRARY_TOOLS: readonly string[] = ['pencil', 'eraser', 'spray', 'fill', 'shade', 'gradient', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon'];

const BRUSH_TOOLS: readonly string[] = ['pencil', 'eraser', 'shade', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon'];

export { BRUSH_TOOLS, LIBRARY_TOOLS, OPTIONS_PANEL_TEXT };
