/* @layer renderer-app @kind logic */
import { fileExtension } from './file-extension';
import { BXEL_EXTENSIONS } from './files.constants';

const isArtworkPath = (path: string): boolean => BXEL_EXTENSIONS.includes(fileExtension(path));

export { isArtworkPath };
