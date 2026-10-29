/* @layer renderer-app @kind logic */
import { toSlashes } from '../../../workspace/to-slashes';

const normalRoot = (path: string): string => toSlashes(path).replace(/\/+$/, '').toLowerCase();

export { normalRoot };
