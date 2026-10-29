/* @layer core @kind logic */
import { z } from 'zod';
import { PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { FILE_PLACE_SCHEMA, ORGANISE_OP_VALUES } from '../schema/project-files.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const collection = z.strictObject({ id: z.string(), name: z.string(), assets: z.number().int().min(0) });

const organiseTool = defineTool(TOOL_NAME.organise, {
  title: 'Organise files',
  description:
    'Tags, pins and collects the files of the open project, and keeps saved searches. The project file stores it, keyed by asset id, so a move or rename keeps it. ' +
    'tag and untag need tags (untag with none removes every tag); pin and unpin need only the files; collect and uncollect need a collection (id or name); ' +
    'newCollection needs a name and may take files; renameCollection needs collection and name; deleteCollection needs collection; ' +
    'saveSearch needs name and query (the search box grammar, such as kind:sprite tag:hero is:unsaved); removeSearch needs search (id or name). ' +
    'Name the files with files (a folder id and path each) or with assets (asset ids from list_assets). The project must be open in Bxel.',
  input: z.strictObject({
    projectId: PROJECT_ID_SCHEMA,
    op: z.enum(ORGANISE_OP_VALUES),
    files: z.array(FILE_PLACE_SCHEMA).max(200).optional(),
    assets: z.array(z.string().min(1).max(128)).max(200).optional(),
    tags: z.array(z.string().min(1).max(40)).max(32).optional(),
    collection: z.string().min(1).max(128).optional(),
    name: z.string().min(1).max(60).optional(),
    query: z.string().min(1).max(300).optional(),
    search: z.string().min(1).max(128).optional(),
  }),
  output: withFailure({
    projectId: PROJECT_ID_SCHEMA,
    note: z.string(),
    affected: z.number().int().min(0).describe('How many files the change named.'),
    collections: z.array(collection),
    searches: z.array(z.strictObject({ id: z.string(), name: z.string(), query: z.string() })),
  }),
});

export { organiseTool };
