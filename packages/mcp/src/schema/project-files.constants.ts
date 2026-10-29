/* @layer core @kind constants */
import { z } from 'zod';
import { ASSET_KIND_SCHEMA } from './assets.constants';
import { FOLDER_ID_SCHEMA } from './ids.constants';
import { LOCATION_SCHEMA } from './place.constants';
import { REL_PATH_SCHEMA } from './shapes.constants';

const FILE_PLACE_SCHEMA = z
  .strictObject({ folderId: FOLDER_ID_SCHEMA, path: REL_PATH_SCHEMA })
  .meta({ id: 'FilePlace', description: 'A file or a folder of the project: the id of its project folder and its path inside that folder, from list_files or list_assets.' });

const FOLDER_PLACE_SCHEMA = z
  .strictObject({ folderId: FOLDER_ID_SCHEMA, path: REL_PATH_SCHEMA.optional().describe('Left out for the folder itself.') })
  .meta({ id: 'FolderPlace', description: 'A folder of the project: the id of its project folder and an optional path inside it.' });

const LINK_STATE_VALUES = ['ok', 'moved', 'ambiguous', 'missing'] as const;

const LINK_STATE_SCHEMA = z.enum(LINK_STATE_VALUES).meta({
  id: 'LinkState',
  description: 'ok: the stored path holds the asset. moved: the path is out of date and exactly one other file has the asset. ambiguous: several files have it. missing: no file has it.',
});

const REFERENCE_SCHEMA = z
  .strictObject({
    assetId: z.string().describe('The asset id the link names.'),
    kind: ASSET_KIND_SCHEMA.nullable().describe('Null when the file is gone and its kind cannot be told.'),
    name: z.string(),
    location: LOCATION_SCHEMA.nullable().describe('Null when no file holds the asset.'),
    state: LINK_STATE_SCHEMA,
  })
  .meta({ id: 'Reference' });

const HEALTH_CHECK_VALUES = ['broken', 'moved', 'unused', 'misplaced', 'duplicates', 'unsaved', 'access'] as const;

const HEALTH_CHECK_SCHEMA = z.enum(HEALTH_CHECK_VALUES).meta({
  id: 'HealthCheck',
  description: 'broken: a link to a file that is gone. moved: a link with an old path. unused: nothing uses the file. misplaced: a file in the folder of another kind. duplicates: two files with one asset id. unsaved: files with changes not on disk. access: linked folders without permission.',
});

const FIX_BY_VALUES = ['id', 'path', 'remove'] as const;

const ORGANISE_OP_VALUES = ['tag', 'untag', 'pin', 'unpin', 'collect', 'uncollect', 'newCollection', 'renameCollection', 'deleteCollection', 'saveSearch', 'removeSearch'] as const;

export { FILE_PLACE_SCHEMA, FIX_BY_VALUES, FOLDER_PLACE_SCHEMA, HEALTH_CHECK_SCHEMA, HEALTH_CHECK_VALUES, ORGANISE_OP_VALUES, REFERENCE_SCHEMA };
