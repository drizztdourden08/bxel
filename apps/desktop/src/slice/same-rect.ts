/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/document';

const sameRect = (a: Rect, b: Rect): boolean => a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;

export { sameRect };
