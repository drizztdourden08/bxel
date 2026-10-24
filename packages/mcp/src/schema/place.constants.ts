/* @layer core @kind constants */
import { z } from 'zod';
import { FOLDER_ID_SCHEMA, PROJECT_ID_SCHEMA, RECENT_ID_SCHEMA } from './ids.constants';
import { REL_PATH_SCHEMA } from './shapes.constants';

const LOCATION_SCHEMA = z
  .strictObject({
    projectId: PROJECT_ID_SCHEMA,
    folderId: FOLDER_ID_SCHEMA,
    path: REL_PATH_SCHEMA,
  })
  .meta({ id: 'Location' });

const RECENT_REF_SCHEMA = z.strictObject({ recentId: RECENT_ID_SCHEMA });

const FILE_REF_SCHEMA = z.xor([LOCATION_SCHEMA, RECENT_REF_SCHEMA]).meta({ id: 'FileRef' });

const PLACE_SCHEMA = z
  .union([
    z.null(),
    LOCATION_SCHEMA,
    RECENT_REF_SCHEMA,
    z.strictObject({ 'aiFolder': z.literal(true) }),
    z.strictObject({ project: z.strictObject({ name: z.string(), granted: z.literal(false) }) }),
  ])
  .meta({ id: 'Place', description: 'Where an open document lives, as the assistant may see it. Null means untitled.' });

export { FILE_REF_SCHEMA, LOCATION_SCHEMA, PLACE_SCHEMA };
