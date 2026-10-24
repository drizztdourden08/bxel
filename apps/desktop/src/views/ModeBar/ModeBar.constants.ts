/* @layer renderer-app @kind constants */
import { SHEET_COMMAND } from '../../keymap/sheet-command-id.constants';
import type { SpriteMode } from '../../stores/sprite-store.type';
import type { HintSpec } from '../ActionHint';

const MODE_HINTS: Readonly<Record<SpriteMode, HintSpec>> = {
  sprite: {
    name: 'Sprite',
    description: 'Edit one sprite at a time.',
    shortcuts: [{ command: SHEET_COMMAND.modeSprite }],
  },
  sheet: {
    name: 'Sheet',
    description: 'See every sprite on one sheet and arrange them.',
    shortcuts: [{ command: SHEET_COMMAND.modeSheet }],
  },
  tilemap: {
    name: 'Tilemap',
    description: 'Build a map from reusable tiles. Placing a tile never changes its pixels.',
    shortcuts: [{ command: SHEET_COMMAND.modeTilemap }],
  },
};

const BACK_HINT: HintSpec = {
  name: 'Back to sheet',
  description: 'Leave this sprite and return to the whole sheet.',
  shortcuts: [{ command: SHEET_COMMAND.back }],
};

const PAINT_ALL_HINT: HintSpec = {
  name: 'Paint all selected',
  description: 'Strokes and fills land on every selected sprite at once.',
  shortcuts: [{ command: SHEET_COMMAND.broadcast }],
};

export { BACK_HINT, MODE_HINTS, PAINT_ALL_HINT };
