/* @layer renderer-app @kind logic */
import { parentOf } from '../workspace/parent-of';

const folderLabel = (path: string, fallback: string): string => {
  const last = parentOf(path).split('/').at(-1);
  return last === undefined || last === '' ? fallback : last;
};

export { folderLabel };
