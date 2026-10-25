/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { EditorTarget } from './editor.type';
import { samplePixel } from './sample-pixel';
import { slotName } from './slot-name';

const cellColourName = (target: EditorTarget, at: Point): string => slotName(target, samplePixel(target, at));

export { cellColourName };
