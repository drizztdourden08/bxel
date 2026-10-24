/* @layer core @kind logic */
import { z } from 'zod';
import { DOCUMENT_ID_SCHEMA, FOLDER_ID_SCHEMA, PROJECT_ID_SCHEMA } from '../schema/ids.constants';
import { LIST_ENTRIES_DEFAULT, LIST_ENTRIES_MAX } from '../limits/limits.constants';
import { REL_PATH_SCHEMA, TIMESTAMP_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { DEFAULT_FILE_KINDS, FILE_KIND_SCHEMA } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const folderEntry = z.strictObject({ name: z.string(), kind: z.literal('folder') });

const fileEntry = z.strictObject({
  name: z.string(),
  kind: FILE_KIND_SCHEMA,
  bytes: z.number().int().min(0),
  modifiedAt: TIMESTAMP_SCHEMA,
  documentId: DOCUMENT_ID_SCHEMA.nullable(),
});

const listFilesTool = defineTool(TOOL_NAME.listFiles, {
  title: 'List files',
  description:
    'One folder of a granted project, one level deep, folders first, then files by name. Names that break the path rules are counted in skipped. Links that lead outside a granted folder are left out.',
  input: z.strictObject({
    projectId: PROJECT_ID_SCHEMA,
    folderId: FOLDER_ID_SCHEMA,
    path: REL_PATH_SCHEMA.optional().describe("Default: the folder's root."),
    kinds: z.array(FILE_KIND_SCHEMA).default([...DEFAULT_FILE_KINDS]),
    offset: z.number().int().min(0).default(0),
    limit: z.number().int().min(1).max(LIST_ENTRIES_MAX).default(LIST_ENTRIES_DEFAULT),
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
