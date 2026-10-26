/* @layer renderer-app @kind logic */
import type { Animation, Artwork, AssetKey } from '@bxel/document';

const unique = (keys: readonly AssetKey[]): AssetKey[] => [...new Map(keys.map((key) => [`${key.kind}:${key.id}`, key])).values()];

const animationLinks = (artwork: Artwork, animation: Animation): AssetKey[] => {
  const files = animation.frames.flatMap((frame) => {
    const sprite = frame.spriteId === null ? undefined : artwork.sprites.find((each) => each.id === frame.spriteId);
    return sprite?.role === 'sprite' ? [{ kind: 'sprite', id: sprite.id } as const] : [];
  });
  return unique([{ kind: 'palette', id: animation.bankId }, ...files]);
};

const tilesetLinks = (artwork: Artwork, id: string): AssetKey[] => {
  const tileset = artwork.tilesets.find((each) => each.id === id);
  if (!tileset) return [];
  const played = tileset.tiles.flatMap((tile) => (tile.animation ? [{ kind: 'animation', id: tile.animation.animationId } as const] : []));
  return unique([{ kind: 'palette', id: tileset.bankId }, ...played]);
};

const sheetLinks = (artwork: Artwork, id: string): AssetKey[] => {
  const sheet = artwork.sheets.find((each) => each.id === id);
  const sprites = (sheet?.entries ?? []).map((entry): AssetKey => ({ kind: 'sprite', id: entry.spriteId }));
  const animations = (sheet?.animationEntries ?? []).map((entry): AssetKey => ({ kind: 'animation', id: entry.animationId }));
  return unique([...sprites, ...animations]);
};

const linkedKeys = (artwork: Artwork, key: AssetKey): readonly AssetKey[] => {
  if (key.kind === 'sprite') {
    const sprite = artwork.sprites.find((each) => each.id === key.id);
    return sprite ? [{ kind: 'palette', id: sprite.bankId }] : [];
  }
  if (key.kind === 'animation') {
    const animation = artwork.animations.find((each) => each.id === key.id);
    return animation ? animationLinks(artwork, animation) : [];
  }
  if (key.kind === 'tileset') return tilesetLinks(artwork, key.id);
  if (key.kind === 'sheet') return sheetLinks(artwork, key.id);
  const tilemap = key.kind === 'tilemap' ? artwork.tilemaps.find((each) => each.id === key.id) : undefined;
  return tilemap ? [{ kind: 'tileset', id: tilemap.tilesetId }] : [];
};

export { linkedKeys };
