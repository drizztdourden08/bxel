/* @layer renderer-app @kind logic */
import { OPAQUE_ALPHA } from '@bxel/document';

const alphaToUnit = (alpha: number): number => alpha / OPAQUE_ALPHA;

export { alphaToUnit };
