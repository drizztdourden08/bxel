/* @layer renderer-app @kind logic */
import { BXEL_SUFFIX } from './files.constants';

const isArtworkPath = (path: string): boolean => path.toLowerCase().endsWith(BXEL_SUFFIX);

export { isArtworkPath };
