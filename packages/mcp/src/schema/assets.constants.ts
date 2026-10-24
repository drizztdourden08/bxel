/* @layer core @kind constants */
import { z } from 'zod';

const ASSET_KIND_VALUES = ['sprite', 'sheet', 'palette', 'tileset', 'tilemap'] as const;

const ASSET_KIND_SCHEMA = z.enum(ASSET_KIND_VALUES).meta({
  id: 'AssetKind',
  description: 'sprite (.bxsprite), sheet (.bxsheet), palette (.bxpalette), tileset (.bxtiles) or tilemap (.bxmap).',
});

const ASSET_REF_SCHEMA = z
  .strictObject({ kind: ASSET_KIND_SCHEMA, id: z.string().min(1).max(64) })
  .meta({ id: 'AssetRef', description: 'One asset of a workspace document: its kind and its id from open_file, create_document or list_assets.' });

export { ASSET_KIND_SCHEMA, ASSET_KIND_VALUES, ASSET_REF_SCHEMA };
