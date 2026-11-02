/* @layer core @kind test */
import { decodeBrushPixels } from '@bxel/document';

const entryValues = (pixels: string | undefined): number[] => [...decodeBrushPixels(pixels ?? '')];

export { entryValues };
