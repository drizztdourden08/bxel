/* @layer renderer-app @kind constants */
import type { ToolId } from '../../editor/tool.type';

const OPTIONS_TEXT = {
  region: 'Tool options',
  zone: 'bxel.options-bar',
  menuLabel: 'Tool options menu',
  custom: 'Custom',
  chipLabel: (tool: string, preset: string): string => `${tool}, ${preset}`,
  chipDescription: 'The tool these options belong to, and its preset. Open it to pick a preset or save one.',
  resetOption: 'Reset this option',
  resetAll: 'Reset all tools',
  more: 'More options',
  moreDescription: 'Open the Tool options panel with every option of the tool, presets and reset.',
  sheetName: 'Sheet',
  sheetHint: 'Pick a sprite to paint it',
  noOptions: 'Nothing to set',
} as const;

const TOOL_HINTS: Readonly<Partial<Record<ToolId, string>>> = {
  zoom: 'Click zooms in, right click zooms out',
  hand: 'Drag to move the canvas',
  picker: 'Click picks the front colour, right click the back colour',
  move: 'Drag the selection, or nudge it with the arrow keys',
};

export { OPTIONS_TEXT, TOOL_HINTS };
