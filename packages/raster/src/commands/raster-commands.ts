/* @layer core @kind logic */
import type { CommandDef } from '@bxel/document';
import { pixelsErase } from './pixels-erase';
import { pixelsFill } from './pixels-fill';
import { pixelsPaint } from './pixels-paint';
import { pixelsShape } from './pixels-shape';

const rasterCommands: readonly CommandDef[] = [pixelsPaint, pixelsErase, pixelsFill, pixelsShape];

export { rasterCommands };
