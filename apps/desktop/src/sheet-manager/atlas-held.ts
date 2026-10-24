/* @layer renderer-app @kind logic */
import type { Sheet, Sprite } from '@bxel/document';
import type { AtlasHeld } from './manager.type';

const atlasHeld = (sheet: Sheet, sprites: readonly Sprite[]): AtlasHeld[] => {
  const byId = new Map(sprites.map((sprite) => [sprite.id, sprite] as const));
  return sheet.entries.flatMap((entry) => {
    const sprite = byId.get(entry.spriteId);
    return sprite ? [{ sprite, at: entry.at, source: { x: 0, y: 0, width: sprite.width, height: sprite.height } }] : [];
  });
};

export { atlasHeld };
