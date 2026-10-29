/* @layer renderer-app @kind logic */
import type { Sheet, Sprite } from '@bxel/document';

const spriteOnSheet = (sprite: Sprite | null, sheet: Sheet | null): boolean =>
  sprite !== null && (sheet?.entries.some((entry) => entry.spriteId === sprite.id) ?? false);

export { spriteOnSheet };
