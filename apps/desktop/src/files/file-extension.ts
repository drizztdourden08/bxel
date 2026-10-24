/* @layer renderer-app @kind logic */
import { fileName } from './file-name';

const fileExtension = (path: string): string => {
  const name = fileName(path);
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
};

export { fileExtension };
