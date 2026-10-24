/* @layer renderer-app @kind logic */
import { fileName } from './file-name';
import { BXEL_SUFFIX } from './files.constants';

const documentName = (artworkName: string, path: string | undefined): string =>
  path === undefined ? `${artworkName}${BXEL_SUFFIX}` : fileName(path);

export { documentName };
