/* @layer renderer-app @kind constants */
import type { IconName } from '@drizztdourden08/tessera';
import { COMMAND_ID } from '../../keymap/keymap.constants';
import type { TileMode, ViewToggle } from '../../stores/view-store.type';
import type { HintSpec } from '../ActionHint';

const CANVAS_TEXT = {
  region: 'Canvas',
  fitCaption: 'Fit',
  actualCaption: '1:1',
  tiledOptions: 'Tiled preview',
} as const;

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
  gridIso: {
    name: 'Isometric grid',
    description: 'Draw a 2 to 1 diamond grid as wide as one tile, to line up isometric art.',
    shortcuts: [{ command: COMMAND_ID.isoGrid }],
  },
  guides: {
    name: 'Guides',
    description: 'Show the guide lines you dragged out of the rulers.',
    shortcuts: [{ command: COMMAND_ID.guides }],
  },
  rulers: {
    name: 'Rulers',
    description: 'Show the pixel rulers along the top and the left of the canvas.',
    shortcuts: [{ command: COMMAND_ID.rulers }],
  },
  snap: {
    name: 'Snap',
    description: 'Guides and moved sprites land on the grid lines. Hold Alt to turn it off for one drag.',
    shortcuts: [{ command: COMMAND_ID.snap }],
  },
  slices: {
    name: 'Slices',
    description: 'Show the named slice rectangles of the sprite with their pivot and 9-slice centre. The Slice tool shows them too.',
    shortcuts: [{ command: COMMAND_ID.slices }],
  },
  hideOverlays: {
    name: 'Hide overlays',
    description: 'Hide the grids, guides, axes, selection ants and onion skin at once, for a clean look at the art.',
    shortcuts: [{ command: COMMAND_ID.hideOverlays }],
  },
  mirror: {
    name: 'Mirror view',
    description: 'Flip the display left to right to spot mistakes. The pixels do not change and painting stays under the pointer.',
    shortcuts: [{ command: COMMAND_ID.mirrorView }],
  },
  loupe: {
    name: 'Loupe',
    description: 'Show a round magnifier beside the pointer at four times the zoom.',
    shortcuts: [{ command: COMMAND_ID.loupe }],
  },
  backgroundPreview: {
    name: 'Background preview',
    description: 'Show the art over the preview background to check how it sits on it. Hold the key to peek, tap it to toggle.',
    shortcuts: [{ command: COMMAND_ID.backgroundPreview }],
  },
  fullscreen: {
    name: 'Fullscreen preview',
    description: 'Show the art at a whole number scale on the background. Press any key to return.',
    shortcuts: [{ command: COMMAND_ID.fullscreenPreview }],
  },
  split: {
    name: 'Split view',
    description: 'Show a second view of the same art beside the first, at its own zoom.',
    shortcuts: [{ command: COMMAND_ID.splitView }],
  },
  splitLink: {
    name: 'Link views',
    description: 'Pan and zoom both split views together.',
    shortcuts: [{ command: COMMAND_ID.splitLink }],
  },
  splitActual: {
    name: 'Actual size in second view',
    description: 'Keep the second split view at actual size while the first one zooms.',
    shortcuts: [{ command: COMMAND_ID.splitActual }],
  },
  lockGuides: {
    name: 'Lock guides',
    description: 'Keep the guides where they are so a drag cannot move or remove them.',
    shortcuts: [{ command: COMMAND_ID.lockGuides }],
  },
};

const VIEW_TOGGLES: readonly ViewToggle[] = ['grid', 'gridMajor', 'gridTile', 'guides', 'rulers', 'snap'];

const VIEW_ICONS: Readonly<Record<ViewToggle, IconName>> = {
  grid: 'pixel-grid',
  gridMajor: 'layout-grid',
  gridTile: 'columns-3',
  gridIso: 'pixel-view-grid-iso',
  guides: 'guides',
  rulers: 'pixel-rulers',
  snap: 'pixel-view-snap',
  slices: 'square',
  hideOverlays: 'eye-off',
  mirror: 'pixel-view-mirror',
  loupe: 'pixel-view-loupe',
  backgroundPreview: 'image',
  fullscreen: 'maximize-2',
  split: 'pixel-view-split',
  splitLink: 'pixel-view-split-link',
  splitActual: 'pixel-view-split-actual',
  lockGuides: 'lock',
};

const TILED_HINT: HintSpec = {
  name: 'Tiled preview',
  description: 'Repeat the canvas around itself to check that a pattern joins without a seam. Painting continues across the matching edge.',
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

const GROUP_IDS = {
  symmetry: 'symmetry',
  view: 'view',
  playback: 'playback',
  zoom: 'zoom',
  transform: 'transform',
} as const;

export {
  CANVAS_TEXT, GROUP_IDS, MIRROR_X_HINT, MIRROR_Y_HINT, ONION_HINT, PAUSE_HINT, PLAY_HINT,
  TILED_HINT, TILED_HINTS, VIEW_HINTS, VIEW_ICONS, VIEW_TOGGLES, ZOOM_ACTUAL_HINT, ZOOM_FIT_HINT,
};
