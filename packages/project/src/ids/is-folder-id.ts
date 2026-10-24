/* @layer core @kind logic */
import { FOLDER_ID_REGEX } from './id.constants';
import type { FolderId } from './id.type';

const isFolderId = (value: unknown): value is FolderId =>
  typeof value === 'string' && FOLDER_ID_REGEX.test(value);

export { isFolderId };
