/* @layer core @kind logic */
import { z } from 'zod';
import { ASSET_KIND_SCHEMA, ASSET_KIND_VALUES } from '../schema/assets.constants';
import { DOCUMENT_ID_SCHEMA, FOLDER_ID_SCHEMA, PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { PAGING_SHAPE } from '../schema/paging.constants';
import { REL_PATH_SCHEMA, TIMESTAMP_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { ASSET_STATE_VALUES } from './list-assets-tool.constants';
import { TOOL_NAME } from './tool-name.constants';

const assetEntry = z.strictObject({
  kind: ASSET_KIND_SCHEMA,
  id: z.string().nullable().describe('Null while the file is not opened yet. open_file loads it.'),
  name: z.string(),
  fileName: z.string().nullable(),
  location: LOCATION_SCHEMA.nullable(),
  dirty: z.boolean(),
  opened: z.boolean(),
  usedBy: z.array(z.string()).describe('For a sprite, the ids of the sheets and animations that use it. For an animation, the ids of the sheets and tilesets that play it.'),
  documentId: DOCUMENT_ID_SCHEMA.nullable(),
  modifiedAt: TIMESTAMP_SCHEMA.nullable(),
  tags: z.array(z.string()).describe('The tags the project keeps for the asset.'),
  collections: z.array(z.string()).describe('The names of the collections that hold the asset.'),
  pinned: z.boolean(),
  states: z.array(z.enum(ASSET_STATE_VALUES)).describe('unsaved: changed and not written. open: has a tab. unused: a loaded sprite, animation, palette or tileset nothing uses. missing: a link of the file does not resolve; only listed when the links were read.'),
  uses: z.array(z.string()).nullable().describe('The ids of the assets this asset links to. Null unless withLinks is true or states asks for missing.'),
  missingLinks: z.array(z.strictObject({ linkId: z.string(), targetName: z.string(), state: z.string() })).nullable().describe('The links of this asset whose target cannot be found. Null unless the links were read.'),
});

const listAssetsTool = defineTool(TOOL_NAME.listAssets, {
  title: 'List assets',
  description:
    'Every Bxel asset of a granted project in one flat list: sprites (.bxsprite), animations (.bxanim), sheets (.bxsheet), palettes (.bxpalette), tilesets (.bxtiles) and tilemaps (.bxmap), across all its folders the assistant may see. Narrow it with kinds, a folder, a name search, a query with tokens (tag:hero is:unused), or usedBy to get only the assets that use one sprite or one animation. Assets are sorted by name.',
  input: z.strictObject({
    projectId: PROJECT_ID_SCHEMA,
    kinds: z.array(ASSET_KIND_SCHEMA).default([...ASSET_KIND_VALUES]),
    folderId: FOLDER_ID_SCHEMA.optional().describe('Only assets in this folder of the project.'),
    path: REL_PATH_SCHEMA.optional().describe('Only assets under this path of the folder. Needs folderId.'),
    usedBy: z.string().min(1).max(64).optional().describe('A sprite or animation id. Lists the assets that use it.'),
    search: z.string().max(64).optional().describe('Part of an asset name, any case.'),
    query: z
      .string()
      .max(300)
      .optional()
      .describe('The search box of the Project window: words match names and folders; kind:sprite, tag:hero, collection:name, in:folder, uses:name, usedby:name, is:unused, is:unsaved, is:open, is:pinned, size>64, colours<16. Kinds add up, other tokens narrow.'),
    states: z.array(z.enum(ASSET_STATE_VALUES)).optional().describe('Only assets that are in all of these states, as the chips of the Project widget: unsaved, open, missing (a link cannot be resolved; reads the links of every file), unused.'),
    withLinks: z.boolean().default(false).describe('Read the links of every file, so each asset lists uses and missingLinks. It reads every asset file of the project, so it is slower.'),
    ...PAGING_SHAPE,
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
