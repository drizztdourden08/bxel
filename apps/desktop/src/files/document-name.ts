/* @layer renderer-app @kind logic */
import { fileName } from './file-name';
import { BXEL_SUFFIX } from './files.constants';

const documentName = (projectName: string, path: string | undefined): string =>
  path === undefined ? `${projectName}${BXEL_SUFFIX}` : fileName(path);

export { documentName };
