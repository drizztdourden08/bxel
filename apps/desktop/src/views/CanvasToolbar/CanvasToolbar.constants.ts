/* @layer renderer-app @kind constants */
import type { IconName } from '@drizztdourden08/tessera';
import { COMMAND_ID } from '../../keymap/keymap.constants';
import { SHEET_COMMAND } from '../../keymap/sheet-command-id.constants';
import type { SpriteMode } from '../../stores/sprite-store.type';
import type { TileMode, ViewToggle } from '../../stores/view-store.type';
import type { HintSpec } from '../ActionHint';

const CANVAS_TEXT = {
  region: 'Canvas',
  mode: 'Mode',
  modeDescription: 'What the canvas shows and edits.',
  backCaption: 'Back',
  paintAllCaption: 'Paint all',
  fitCaption: 'Fit',
  actualCaption: '1:1',
  tiledOptions: 'Tiled preview',
} as const;

const MODE_ORDER: readonly SpriteMode[] = ['sprite', 'sheet', 'tilemap'];

const MODE_ICONS: Readonly<Record<SpriteMode, IconName>> = {
  sprite: 'image',
  sheet: 'layout-dashboard',
  tilemap: 'map',
};

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

const MIRROR_X_HINT: HintSpec = {
  name: 'Mirror X',
  description: 'Mirror strokes from left to right across the symmetry line.',
  shortcuts: [{ command: COMMAND_ID.symmetryX }],
};

const MIRROR_Y_HINT: HintSpec = {
  name: 'Mirror Y',
  description: 'Mirror strokes from top to bottom across the symmetry line.',
  shortcuts: [{ command: COMMAND_ID.symmetryY }],
};

const VIEW_HINTS: Readonly<Record<ViewToggle, HintSpec>> = {
  grid: {
    name: 'Pixel grid',
    description: 'Draw a line between every pixel when the canvas is zoomed in.',
    shortcuts: [{ command: COMMAND_ID.pixelGrid }],
  },
  gridMajor: {
    name: 'Major grid',
    description: 'Draw a stronger line every few pixels, to count distances.',
    shortcuts: [{ command: COMMAND_ID.majorGrid }],
  },
  gridTile: {
    name: 'Tile grid',
    description: 'Draw the borders of the tiles over the canvas.',
    shortcuts: [{ command: COMMAND_ID.tileGrid }],
  },
  rulers: {
    name: 'Rulers',
    description: 'Show the pixel rulers along the top and the left of the canvas.',
    shortcuts: [{ command: COMMAND_ID.rulers }],
  },
};

const VIEW_TOGGLES: readonly ViewToggle[] = ['grid', 'gridMajor', 'gridTile', 'rulers'];

const VIEW_ICONS: Readonly<Record<ViewToggle, IconName>> = {
  grid: 'hash',
  gridMajor: 'layout-grid',
  gridTile: 'columns-3',
  rulers: 'sliders-horizontal',
};

const TILED_HINT: HintSpec = {
  name: 'Tiled preview',
  description: 'Repeat the canvas around itself to check that a pattern joins without a seam.',
};

const TILED_HINTS: Readonly<Record<TileMode, HintSpec>> = {
  off: { name: 'Off', description: 'Show the canvas once.', shortcuts: [{ command: COMMAND_ID.tiledOff }] },
  x: { name: 'Horizontal', description: 'Repeat the canvas from left to right.', shortcuts: [{ command: COMMAND_ID.tiledX }] },
  y: { name: 'Vertical', description: 'Repeat the canvas from top to bottom.', shortcuts: [{ command: COMMAND_ID.tiledY }] },
  both: { name: 'Both', description: 'Repeat the canvas in both directions.', shortcuts: [{ command: COMMAND_ID.tiledBoth }] },
};

const ONION_HINT: HintSpec = {
  name: 'Onion skin',
  description: 'Show the frames before and after this one as ghosts behind your pixels.',
};

const PLAY_HINT: HintSpec = {
  name: 'Play',
  description: 'Play the animation of this sprite on the canvas.',
};

const PAUSE_HINT: HintSpec = {
  name: 'Pause',
  description: 'Stop the animation on the current frame.',
};

const ZOOM_FIT_HINT: HintSpec = {
  name: 'Zoom to fit',
  description: 'Zoom so the whole canvas fits in the window.',
  shortcuts: [{ command: COMMAND_ID.zoomFit }],
};

const ZOOM_ACTUAL_HINT: HintSpec = {
  name: 'Actual size',
  description: 'Show every pixel of the sprite as one screen pixel.',
  shortcuts: [{ command: COMMAND_ID.zoomActual }],
};

const SEPARATORS = {
  mode: 'after-mode',
  symmetry: 'after-symmetry',
  view: 'after-view',
  playback: 'after-playback',
  zoom: 'after-zoom',
} as const;

export {
  BACK_HINT, CANVAS_TEXT, MIRROR_X_HINT, MIRROR_Y_HINT, MODE_HINTS, MODE_ICONS, MODE_ORDER, ONION_HINT, PAINT_ALL_HINT, PAUSE_HINT, PLAY_HINT, SEPARATORS,
  TILED_HINT, TILED_HINTS, VIEW_HINTS, VIEW_ICONS, VIEW_TOGGLES, ZOOM_ACTUAL_HINT, ZOOM_FIT_HINT,
};
