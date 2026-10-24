/* @layer renderer-app @kind logic */
import { fileName } from './file-name';

const baseName = (path: string): string => {
  const name = fileName(path);
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(0, dot) : name;
};

export { baseName };
