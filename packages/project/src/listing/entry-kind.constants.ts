/* @layer core @kind constants */
import { ASSET_FORMAT, LEGACY_FORMAT } from '@bxel/document';

const ENTRY_KINDS = [
  'sprite',
  'animation',
  'sheet',
  'palette',
  'tileset',
  'tilemap',
  'project',
  'legacy',
  'image',
  'data',
  'other',
] as const;

const DEFAULT_ENTRY_KINDS = ENTRY_KINDS.filter((kind) => kind !== 'other');

const bare = (extension: string): string => extension.slice(1);

const KIND_OF_ENTRY_EXTENSION: Readonly<Record<string, (typeof ENTRY_KINDS)[number]>> = {
  [bare(ASSET_FORMAT.sprite.extension)]: 'sprite',
  [bare(ASSET_FORMAT.animation.extension)]: 'animation',
  [bare(ASSET_FORMAT.sheet.extension)]: 'sheet',
  [bare(ASSET_FORMAT.palette.extension)]: 'palette',
  [bare(ASSET_FORMAT.tileset.extension)]: 'tileset',
  [bare(ASSET_FORMAT.tilemap.extension)]: 'tilemap',
  [bare(ASSET_FORMAT.project.extension)]: 'project',
  [bare(LEGACY_FORMAT.extension)]: 'legacy',
  gpl: 'palette',
  pal: 'palette',
  hex: 'palette',
  png: 'image',
  apng: 'image',
  gif: 'image',
  json: 'data',
};

export { DEFAULT_ENTRY_KINDS, ENTRY_KINDS, KIND_OF_ENTRY_EXTENSION };
