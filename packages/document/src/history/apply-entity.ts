/* @layer core @kind logic */
import type { Animation } from '../model/animation.type';
import type { ExportPreset } from '../model/export-preset.type';
import type { CelId, SpriteId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import type { Artwork } from '../model/artwork.type';
import type { Sheet } from '../model/sheet.type';
import type { Cel, Sprite, SpriteShell } from '../model/sprite.type';
import type { Tilemap, Tileset } from '../model/tilemap.type';
import { replaceSprite } from '../artwork/replace-sprite';
import { findSprite } from '../read/find-sprite';
import { CEL_PREFIX, COLLECTION_PREFIX, META_PATH, ORDER_PATH, SHELL_PREFIX, SPRITE_PREFIX } from './entity-path.constants';
import type { CollectionKey, ArtworkMeta } from './history.type';

const setCollection = (artwork: Artwork, key: CollectionKey, value: unknown): Artwork => {
  switch (key) {
    case 'banks':
      return { ...artwork, banks: value as readonly PaletteBank[] };
    case 'sheets':
      return { ...artwork, sheets: value as readonly Sheet[] };
    case 'presets':
      return { ...artwork, presets: value as readonly ExportPreset[] };
    case 'tilesets':
      return { ...artwork, tilesets: value as readonly Tileset[] };
    case 'tilemaps':
      return { ...artwork, tilemaps: value as readonly Tilemap[] };
    case 'animations':
      return { ...artwork, animations: value as readonly Animation[] };
  }
};

const orderSprites = (artwork: Artwork, ids: readonly SpriteId[]): Artwork => {
  const rank = new Map(ids.map((id, index) => [id, index] as const));
  const position = (sprite: Sprite): number => rank.get(sprite.id) ?? ids.length;
  return { ...artwork, sprites: [...artwork.sprites].sort((first, second) => position(first) - position(second)) };
};

const setSprite = (artwork: Artwork, id: SpriteId, value: Sprite | undefined): Artwork => {
  const others = artwork.sprites.filter((sprite) => sprite.id !== id);
  return { ...artwork, sprites: value ? [...others, value] : others };
};

const setShell = (artwork: Artwork, id: SpriteId, shell: SpriteShell | undefined): Artwork => {
  const sprite = findSprite(artwork, id);
  if (!sprite || !shell) return artwork;
  return replaceSprite(artwork, { ...shell, cels: sprite.cels });
};

const setCel = (artwork: Artwork, path: string, cel: Cel | undefined): Artwork => {
  const [spriteId = '', celId = ''] = path.slice(CEL_PREFIX.length).split(':');
  const sprite = findSprite(artwork, spriteId as SpriteId);
  if (!sprite) return artwork;
  const kept = Object.entries(sprite.cels).filter(([key]) => key !== celId);
  const cels = cel ? { ...sprite.cels, [celId as CelId]: cel } : Object.fromEntries(kept);
  return replaceSprite(artwork, { ...sprite, cels });
};

const applyEntity = (artwork: Artwork, path: string, value: unknown): Artwork => {
  if (path === META_PATH) return { ...artwork, ...(value as ArtworkMeta) };
  if (path === ORDER_PATH) return orderSprites(artwork, value as readonly SpriteId[]);
  if (path.startsWith(SPRITE_PREFIX)) {
    return setSprite(artwork, path.slice(SPRITE_PREFIX.length) as SpriteId, value as Sprite | undefined);
  }
  if (path.startsWith(SHELL_PREFIX)) {
    return setShell(artwork, path.slice(SHELL_PREFIX.length) as SpriteId, value as SpriteShell | undefined);
  }
  if (path.startsWith(CEL_PREFIX)) return setCel(artwork, path, value as Cel | undefined);
  return setCollection(artwork, path.slice(COLLECTION_PREFIX.length) as CollectionKey, value);
};

export { applyEntity };
