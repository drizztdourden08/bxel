/* @layer renderer-app @kind constants */
import type { ToolId } from '../../editor/tool.type';

const SIZE_LADDER: readonly number[] = [1, 2, 3, 4, 8, 12, 16, 24, 32];

const OPTIONS_TEXT = {
  region: 'Tool options',
  zone: 'bxel.options-bar',
  menuLabel: 'Tool options menu',
  custom: 'Custom',
  chipLabel: (tool: string, preset: string): string => `${tool}, ${preset}`,
  chipDescription: 'The tool these options belong to, and its preset. Open it to pick a preset or save one.',
  resetOption: 'Reset this option',
  showInBar: 'Show in the bar',
  hideFromBar: 'Hide from the bar',
  assignKey: 'Assign a key...',
  help: 'Help',
  resetAll: 'Reset all tools',
  more: 'More options',
  moreDescription: 'Open the Tool options panel with every option of the tool, presets and reset.',
  sheetName: 'Sheet',
  sheetHint: 'Pick a sprite to paint it',
  noOptions: 'Nothing to set',
  symmetryCaption: 'Symmetry',
  symmetryNames: { x: 'across', y: 'down', diagonal: 'diagonal', turn: '4 way' },
  symmetryOn: (names: readonly string[]): string => `Symmetry on: ${names.join(', ')}`,
  symmetryDescription: 'Strokes, fills and stamps are mirrored. Open the View panel to change or turn off the symmetry.',
} as const;

const TOOL_HINTS: Readonly<Partial<Record<ToolId, string>>> = {
  zoom: 'Click zooms in, right click zooms out',
  hand: 'Drag to move the canvas',
  picker: 'Click picks the front colour, right click the back colour',
  move: 'Drag the selection, or nudge it with the arrow keys',
};

const SYMMETRY_PRIORITY = 900;

export { OPTIONS_TEXT, SIZE_LADDER, SYMMETRY_PRIORITY, TOOL_HINTS };
