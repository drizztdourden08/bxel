/* @layer renderer-app @kind constants */
import type { OptionChoice } from '../tool-options.type';

const MOVE_TEXT = {
  moves: 'Moves',
  movesDescription: 'What the Move tool carries: the selected pixels, or the whole active layer.',
  nudgeUnit: 'Nudge by',
  nudgeUnitDescription: 'How far an arrow key moves: the nudge amount in pixels, or one tile when the sprite has a tile size.',
  autoPick: 'Auto pick layer',
  autoPickDescription: 'Pressing on the canvas selects the topmost layer that has a solid pixel under the pointer.',
} as const;

const MOVE_TARGET_CHOICES: readonly OptionChoice[] = [
  { value: 'selection', label: 'Selection', description: 'Move the selected pixels. With no selection, the whole layer moves.' },
  { value: 'layer', label: 'Layer', description: 'Move the whole active layer, whatever is selected.' },
];

const NUDGE_UNIT_CHOICES: readonly OptionChoice[] = [
  { value: 'pixel', label: '1 px', description: 'An arrow key moves by the nudge amount, one pixel by default.' },
  { value: 'tile', label: 'Tile size', description: 'An arrow key moves by one tile. Without a tile size it moves by the nudge amount.' },
];

export { MOVE_TARGET_CHOICES, MOVE_TEXT, NUDGE_UNIT_CHOICES };
