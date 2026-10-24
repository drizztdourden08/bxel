/* @layer core @kind logic */
import { z } from 'zod';
import { defaultsSchema } from '../defaults/defaults-schema';
import { folderIdSchema } from '../ids/folder-id-schema';
import { projectIdSchema } from '../ids/project-id-schema';
import { ACCESS_LEVELS, MANIFEST_FORMAT } from '../manifest/manifest.constants';
import { isValidSegment } from '../paths/is-valid-segment';
import { PATH_LIMITS } from '../paths/path.constants';
import { checkProjectDocument } from './check-project-document';
import { documentFolderSchema } from './document-folder-schema';
import { PROJECT_DOCUMENT_VERSION } from './project-document.constants';

const projectNameSchema = z
  .string()
  .max(PATH_LIMITS.maxProjectName)
  .refine(isValidSegment, { message: 'A project name follows the file name rule, up to 53 characters.' });

const projectDocumentSchema = z
  .strictObject({
    format: z.literal(MANIFEST_FORMAT),
    formatVersion: z.literal(PROJECT_DOCUMENT_VERSION),
    projectId: projectIdSchema,
    name: projectNameSchema,
    folders: z.array(documentFolderSchema).min(1).max(PATH_LIMITS.maxFolders),
    defaults: defaultsSchema.default({}),
    assistant: z.strictObject({
      access: z.enum(ACCESS_LEVELS),
      folders: z.array(folderIdSchema).optional(),
    }),
  })
  .superRefine((manifest, context) => {
    for (const issue of checkProjectDocument(manifest)) context.addIssue({ code: 'custom', ...issue });
  });

export { projectDocumentSchema };
