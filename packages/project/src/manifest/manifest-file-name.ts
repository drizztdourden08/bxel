/* @layer core @kind logic */
import { MANIFEST_SUFFIX } from '../paths/path.constants';

const manifestFileName = (projectName: string): string => `${projectName}${MANIFEST_SUFFIX}`;

export { manifestFileName };
