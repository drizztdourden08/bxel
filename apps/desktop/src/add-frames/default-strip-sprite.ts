/* @layer renderer-app @kind logic */
import type { Sprite, SpriteId } from '@bxel/document';

const defaultStripSprite = (sprites: readonly Sprite[]): SpriteId | null => (sprites.find((sprite) => sprite.width > sprite.height) ?? sprites[0])?.id ?? null;

export { defaultStripSprite };
