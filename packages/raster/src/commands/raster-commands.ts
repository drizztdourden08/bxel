/* @layer core @kind logic */
import type { CommandDef } from '@bxel/document';
import { pixelsErase } from './pixels-erase';
import { pixelsFill } from './pixels-fill';
import { pixelsFlip } from './pixels-flip';
import { pixelsPaint } from './pixels-paint';
import { pixelsShape } from './pixels-shape';
import { pixelsTurn } from './pixels-turn';
import { spriteFlip } from './sprite-flip';
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
];

export { rasterCommands };
