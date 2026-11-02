/* @layer core @kind test */
import { encodeBrushPixels } from '@bxel/document';

const entryPixels = (values: readonly number[]): string => encodeBrushPixels(Uint8Array.from(values));

export { entryPixels };
