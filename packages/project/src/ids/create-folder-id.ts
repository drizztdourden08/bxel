/* @layer core @kind logic */
import { idBody } from './id-body';
import { ID_PREFIX } from './id.constants';
import type { ByteProvider, FolderId } from './id.type';

const createFolderId = (bytes: ByteProvider): FolderId => `${ID_PREFIX.folder}_${idBody(bytes)}`;

export { createFolderId };
