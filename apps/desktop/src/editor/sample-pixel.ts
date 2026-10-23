/* @layer renderer-app @kind logic */
import { sampleIndex } from '@bxel/document';
import type { Point } from '@bxel/raster';
import type { EditorTarget } from './editor.type';

const samplePixel = (target: EditorTarget, at: Point): number | null => sampleIndex(target.sprite, target.frameId, at);

export { samplePixel };
