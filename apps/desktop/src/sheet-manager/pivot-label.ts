/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';

const pivotLabel = (sprite: Pick<Sprite, 'pivot'>): string => `${sprite.pivot.x2 / 2}, ${sprite.pivot.y2 / 2}`;

export { pivotLabel };
