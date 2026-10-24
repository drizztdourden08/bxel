/* @layer core @kind logic */
import { z } from 'zod';
import { isFolderId } from './is-folder-id';
import type { FolderId } from './id.type';

const folderIdSchema = z.custom<FolderId>(isFolderId, { message: 'A folder id looks like fld_7r2k9m4q.' });

export { folderIdSchema };
