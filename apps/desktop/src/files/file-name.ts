/* @layer renderer-app @kind logic */
import { PATH_SEPARATOR } from './files.constants';

const fileName = (path: string): string => path.split(PATH_SEPARATOR).at(-1) ?? path;

export { fileName };
