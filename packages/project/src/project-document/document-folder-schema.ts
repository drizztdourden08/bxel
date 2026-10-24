/* @layer core @kind logic */
import { folderSchema } from '../manifest/folder-schema';
import { rolesSchema } from './roles-schema';

const documentFolderSchema = folderSchema.extend({ roles: rolesSchema.default({}) });

export { documentFolderSchema };
