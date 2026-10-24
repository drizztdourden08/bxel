/* @layer core @kind logic */
import type { CommandDef } from '@bxel/document';
import { pixelsClear } from './pixels-clear';
import { pixelsErase } from './pixels-erase';
import { pixelsFill } from './pixels-fill';
import { pixelsFlip } from './pixels-flip';
import { pixelsGradient } from './pixels-gradient';
import { pixelsMove } from './pixels-move';
import { pixelsPaint } from './pixels-paint';
import { pixelsReplace } from './pixels-replace';
import { pixelsRotate } from './pixels-rotate';
import { pixelsScale } from './pixels-scale';
import { pixelsShade } from './pixels-shade';
import { pixelsShape } from './pixels-shape';
import { pixelsStamp } from './pixels-stamp';
import { pixelsTurn } from './pixels-turn';
import { spriteFlip } from './sprite-flip';
import { spriteResize } from './sprite-resize';
import { spriteTrim } from './sprite-trim';
import { spriteTurn } from './sprite-turn';

const rasterCommands: readonly CommandDef[] = [
  pixelsPaint,
  pixelsErase,
  pixelsFill,
  pixelsShape,
  pixelsFlip,
  pixelsTurn,
  spriteFlip,
  spriteTurn,
  spriteResize,
  spriteTrim,
  pixelsReplace,
  pixelsShade,
  pixelsGradient,
  pixelsStamp,
  pixelsClear,
  pixelsMove,
  pixelsScale,
  pixelsRotate,
];

export { rasterCommands };
