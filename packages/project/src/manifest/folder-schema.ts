/* @layer core @kind logic */
import { z } from 'zod';
import { folderIdSchema } from '../ids/folder-id-schema';
import { PATH_LIMITS } from '../paths/path.constants';
import { hasControlCharacters } from './has-control-characters';
import { MAX_FOLDER_NAME } from './manifest.constants';

const folderNameSchema = z
  .string()
  .min(1)
  .max(MAX_FOLDER_NAME)
  .refine((name) => !hasControlCharacters(name), { message: 'A folder name has printable characters only.' });

const folderPathSchema = z
  .string()
  .min(1)
  .max(PATH_LIMITS.maxStoredPath)
  .refine((path) => !path.includes('\\') && !hasControlCharacters(path), {
    message: 'A folder path uses forward slashes and printable characters only.',
  });

const folderSchema = z.strictObject({
  folderId: folderIdSchema,
  name: folderNameSchema,
  path: folderPathSchema,
});

export { folderSchema };
