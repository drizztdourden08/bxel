/* @layer renderer-app @kind logic */
import { TRAILING_SEPARATORS } from './export.constants';

const joinPath = (folder: string, name: string): string => {
  const separator = folder.includes('\\') ? '\\' : '/';
  return `${folder.replace(TRAILING_SEPARATORS, '')}${separator}${name}`;
};

export { joinPath };
