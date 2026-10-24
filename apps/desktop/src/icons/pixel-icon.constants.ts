/* @layer renderer-app @kind constants */
import { ACTION_ICONS } from './action-icons.constants';
import { PAINT_ICONS } from './paint-icons.constants';
import { SELECT_ICONS } from './select-icons.constants';
import { SHAPE_ICONS } from './shape-icons.constants';
import { SHEET_ICONS } from './sheet-icons.constants';
import { SPRITE_ICONS } from './sprite-icons.constants';
import { FRAME_ICONS } from './frame-icons.constants';
import { TIMELINE_ICONS } from './timeline-icons.constants';
import { VIEW_ICONS } from './view-icons.constants';
import type { PixelBitmap, PixelIconData, PixelIconName, PixelTone } from './pixel-icon.type';

const PIXEL_ICONS: Readonly<Record<PixelIconName, PixelBitmap>> = {
  ...PAINT_ICONS,
  ...SHAPE_ICONS,
  ...SELECT_ICONS,
  ...VIEW_ICONS,
  ...ACTION_ICONS,
  ...SHEET_ICONS,
  ...SPRITE_ICONS,
  ...TIMELINE_ICONS,
  ...FRAME_ICONS,
};

const PIXEL_ICON_SIZE = 16;

const PIXEL_ICON_SOFT_OPACITY = 0.45;

const TONE_RUNS: Readonly<Record<PixelTone, RegExp>> = {
  solid: /#+/g,
  soft: /\++/g,
};

const PIXEL_ICON_CACHE = new Map<PixelIconName, PixelIconData>();

export { PIXEL_ICON_CACHE, PIXEL_ICON_SIZE, PIXEL_ICON_SOFT_OPACITY, PIXEL_ICONS, TONE_RUNS };
