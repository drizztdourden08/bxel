/* @layer core @kind logic */
import { z } from 'zod';
import { ROOT_FOLDER_PATH } from '../manifest/manifest.constants';
import { checkRelPath } from '../paths/check-rel-path';

const locationPathSchema = (allowFolderRoot: boolean) =>
  z.string().refine((path) => (allowFolderRoot && path === ROOT_FOLDER_PATH) || checkRelPath(path).ok, {
    message: 'A path inside the folder: forward slashes, up to 16 segments, plain names.',
  });

export { locationPathSchema };
