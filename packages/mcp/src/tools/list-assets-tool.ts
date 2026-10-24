/* @layer core @kind logic */
import { z } from 'zod';
import { LIST_ENTRIES_DEFAULT, LIST_ENTRIES_MAX } from '../limits/limits.constants';
import { ASSET_KIND_SCHEMA, ASSET_KIND_VALUES } from '../schema/assets.constants';
import { DOCUMENT_ID_SCHEMA, FOLDER_ID_SCHEMA, PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { REL_PATH_SCHEMA, TIMESTAMP_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const assetEntry = z.strictObject({
  kind: ASSET_KIND_SCHEMA,
  id: z.string().nullable().describe('Null while the file is not opened yet. open_file loads it.'),
  name: z.string(),
  fileName: z.string().nullable(),
  location: LOCATION_SCHEMA.nullable(),
  dirty: z.boolean(),
  opened: z.boolean(),
  usedBy: z.array(z.string()).describe('For a sprite, the ids of the sheets that use it.'),
  documentId: DOCUMENT_ID_SCHEMA.nullable(),
  modifiedAt: TIMESTAMP_SCHEMA.nullable(),
});

const listAssetsTool = defineTool(TOOL_NAME.listAssets, {
  title: 'List assets',
  description:
    'Every Bxel asset of a granted project in one flat list: sprites (.bxsprite), sheets (.bxsheet), palettes (.bxpalette), tilesets (.bxtiles) and tilemaps (.bxmap), across all its folders the assistant may see. Narrow it with kinds, a folder, a name search, or usedBy to get only the sheets that use one sprite. Assets are sorted by name.',
  input: z.strictObject({
    projectId: PROJECT_ID_SCHEMA,
    kinds: z.array(ASSET_KIND_SCHEMA).default([...ASSET_KIND_VALUES]),
    folderId: FOLDER_ID_SCHEMA.optional().describe('Only assets in this folder of the project.'),
    path: REL_PATH_SCHEMA.optional().describe('Only assets under this path of the folder. Needs folderId.'),
    usedBy: z.string().min(1).max(64).optional().describe('A sprite id. Lists the sheets that use it.'),
    search: z.string().max(64).optional().describe('Part of an asset name, any case.'),
    offset: z.number().int().min(0).default(0),
    limit: z.number().int().min(1).max(LIST_ENTRIES_MAX).default(LIST_ENTRIES_DEFAULT),
  }),
  output: withFailure({
    projectId: PROJECT_ID_SCHEMA,
    assets: z.array(assetEntry),
    total: z.number().int().min(0),
    notOpened: z.number().int().min(0).describe('How many listed assets are files that are not loaded yet.'),
    truncated: z.boolean(),
  }),
});

export { listAssetsTool };
