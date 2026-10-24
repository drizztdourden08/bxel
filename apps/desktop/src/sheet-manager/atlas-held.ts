/* @layer renderer-app @kind logic */
import type { AtlasHeld, AtlasInput } from './manager.type';
import { trimBounds } from './trim-bounds';

const atlasHeld = ({ sheet, sprites, trim }: AtlasInput): AtlasHeld[] => {
  const byId = new Map(sprites.map((sprite) => [sprite.id, sprite] as const));
  const trimmed = trim && sheet.layout.kind !== 'manual';
  return sheet.entries.flatMap((entry) => {
    const sprite = byId.get(entry.spriteId);
    if (!sprite) return [];
    const source = trimmed ? trimBounds(sprite) : { x: 0, y: 0, width: sprite.width, height: sprite.height };
    return [{ sprite, at: entry.at, source }];
  });
};

export { atlasHeld };
