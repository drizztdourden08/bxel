/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';

const sizeKey = (sprite: Pick<Sprite, 'width' | 'height'>): string => `${sprite.width}x${sprite.height}`;

export { sizeKey };
