/* @layer core @kind logic */
import { z } from 'zod';
import { folderIdSchema } from '../ids/folder-id-schema';
import { checkRelPath } from '../paths/check-rel-path';
import { ROOT_FOLDER_PATH } from './manifest.constants';

const locationSchema = (allowFolderRoot: boolean) =>
  z.strictObject({
    folderId: folderIdSchema,
    path: z
      .string()
      .refine((path) => (allowFolderRoot && path === ROOT_FOLDER_PATH) || checkRelPath(path).ok, {
        message: 'A path inside the folder: forward slashes, up to 16 segments, plain names.',
      }),
  });

export { locationSchema };
