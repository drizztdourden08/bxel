/* @layer core @kind logic */
import type { ExportPreset } from '../model/export-preset.type';
import type { CelId, SpriteId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import type { Project } from '../model/project.type';
import type { Sheet } from '../model/sheet.type';
import type { Cel, Sprite, SpriteShell } from '../model/sprite.type';
import type { Tilemap, Tileset } from '../model/tilemap.type';
import { replaceSprite } from '../project/replace-sprite';
import { findSprite } from '../read/find-sprite';
import { CEL_PREFIX, COLLECTION_PREFIX, META_PATH, ORDER_PATH, SHELL_PREFIX, SPRITE_PREFIX } from './entity-path.constants';
import type { CollectionKey, ProjectMeta } from './history.type';

const setCollection = (project: Project, key: CollectionKey, value: unknown): Project => {
  switch (key) {
    case 'banks':
      return { ...project, banks: value as readonly PaletteBank[] };
    case 'sheets':
      return { ...project, sheets: value as readonly Sheet[] };
    case 'presets':
      return { ...project, presets: value as readonly ExportPreset[] };
    case 'tilesets':
      return { ...project, tilesets: value as readonly Tileset[] };
    case 'tilemaps':
      return { ...project, tilemaps: value as readonly Tilemap[] };
  }
};

const orderSprites = (project: Project, ids: readonly SpriteId[]): Project => {
  const rank = new Map(ids.map((id, index) => [id, index] as const));
  const position = (sprite: Sprite): number => rank.get(sprite.id) ?? ids.length;
  return { ...project, sprites: [...project.sprites].sort((first, second) => position(first) - position(second)) };
};

const setSprite = (project: Project, id: SpriteId, value: Sprite | undefined): Project => {
  const others = project.sprites.filter((sprite) => sprite.id !== id);
  return { ...project, sprites: value ? [...others, value] : others };
};

const setShell = (project: Project, id: SpriteId, shell: SpriteShell | undefined): Project => {
  const sprite = findSprite(project, id);
  if (!sprite || !shell) return project;
  return replaceSprite(project, { ...shell, cels: sprite.cels });
};

const setCel = (project: Project, path: string, cel: Cel | undefined): Project => {
  const [spriteId = '', celId = ''] = path.slice(CEL_PREFIX.length).split(':');
  const sprite = findSprite(project, spriteId as SpriteId);
  if (!sprite) return project;
  const kept = Object.entries(sprite.cels).filter(([key]) => key !== celId);
  const cels = cel ? { ...sprite.cels, [celId as CelId]: cel } : Object.fromEntries(kept);
  return replaceSprite(project, { ...sprite, cels });
};

const applyEntity = (project: Project, path: string, value: unknown): Project => {
  if (path === META_PATH) return { ...project, ...(value as ProjectMeta) };
  if (path === ORDER_PATH) return orderSprites(project, value as readonly SpriteId[]);
  if (path.startsWith(SPRITE_PREFIX)) {
    return setSprite(project, path.slice(SPRITE_PREFIX.length) as SpriteId, value as Sprite | undefined);
  }
  if (path.startsWith(SHELL_PREFIX)) {
    return setShell(project, path.slice(SHELL_PREFIX.length) as SpriteId, value as SpriteShell | undefined);
  }
  if (path.startsWith(CEL_PREFIX)) return setCel(project, path, value as Cel | undefined);
  return setCollection(project, path.slice(COLLECTION_PREFIX.length) as CollectionKey, value);
};

export { applyEntity };
