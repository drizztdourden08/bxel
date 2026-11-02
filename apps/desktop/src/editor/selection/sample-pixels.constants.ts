/* @layer renderer-app @kind constants */
import { allPixels } from './all-pixels';
import { celPixels } from './cel-pixels';
import { mergedPixels } from './merged-pixels';

const PIXELS_OF = { layer: celPixels, visible: mergedPixels, all: allPixels } as const;

export { PIXELS_OF };
