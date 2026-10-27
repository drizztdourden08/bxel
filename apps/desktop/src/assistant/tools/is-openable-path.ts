/* @layer renderer-app @kind logic */
import { entryKindOf } from '@bxel/project';
import { fileName } from '../../files/file-name';
import { isArtworkPath } from '../../files/is-artwork-path';

const isOpenablePath = (path: string): boolean => isArtworkPath(path) && entryKindOf(fileName(path)) !== 'project';

export { isOpenablePath };
