/* @layer renderer-app @kind logic */
import { MIN_ALPHA, OPAQUE_ALPHA } from '@bxel/document';

const unitToAlpha = (unit: number): number => Math.min(OPAQUE_ALPHA, Math.max(MIN_ALPHA, Math.round(unit * OPAQUE_ALPHA)));

export { unitToAlpha };
