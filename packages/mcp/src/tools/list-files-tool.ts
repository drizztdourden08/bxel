/* @layer core @kind logic */
import { z } from 'zod';
import { DOCUMENT_ID_SCHEMA, FOLDER_ID_SCHEMA, PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { PAGING_SHAPE } from '../schema/paging.constants';
import { REL_PATH_SCHEMA, TIMESTAMP_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { DEFAULT_FILE_KINDS, FILE_KIND_SCHEMA } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const folderEntry = z.strictObject({ name: z.string(), kind: z.literal('folder'), path: z.string(), depth: z.number().int().min(1) });

const fileEntry = z.strictObject({
  name: z.string(),
  kind: FILE_KIND_SCHEMA,
  path: z.string().describe('The path from the listed folder, with slashes. Same as name at depth 1.'),
  depth: z.number().int().min(1).describe('1 for the listed folder, 2 for a folder inside it, and so on.'),
  bytes: z.number().int().min(0),
  modifiedAt: TIMESTAMP_SCHEMA,
  documentId: DOCUMENT_ID_SCHEMA.nullable(),
});

const listFilesTool = defineTool(TOOL_NAME.listFiles, {
  title: 'List files',
  description:
    'One folder of a granted project, folders first, then files by name, one level deep unless depth asks for more. Bxel files (.bxsprite, .bxsheet, .bxpalette, .bxtiles, .bxmap, .bxproject and the older .bxel) have kind bxel; list_assets gives them as assets across all folders. Names that break the path rules are counted in skipped. Folders the owner hid from the assistant and links that lead outside a granted folder are left out.',
  input: z.strictObject({
    projectId: PROJECT_ID_SCHEMA,
    folderId: FOLDER_ID_SCHEMA,
    path: REL_PATH_SCHEMA.optional().describe("Default: the folder's root."),
    kinds: z.array(FILE_KIND_SCHEMA).default([...DEFAULT_FILE_KINDS]),
    depth: z.number().int().min(1).max(8).default(1).describe('How many folder levels to list. 1 is the folder itself; more lists the folders inside it too, as one flat list in tree order (each folder, then what is inside it), so one call returns the tree the Project widget shows.'),
    ...PAGING_SHAPE,
  }),
  output: withFailure({
    path: z.string(),
    entries: z.array(z.union([folderEntry, fileEntry])),
    total: z.number().int().min(0),
    skipped: z.number().int().min(0),
    truncated: z.boolean(),
  }),
});

export { listFilesTool };
