/* @layer renderer-app @kind logic */
import type { PixelDraw } from '../../PixelViewport';
import { paintReferences } from './paint-references';

const paintReferencesUnder: PixelDraw = (ctx) => paintReferences(ctx, false);

export { paintReferencesUnder };
