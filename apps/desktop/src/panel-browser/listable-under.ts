/* @layer renderer-app @kind logic */
import { isListableName } from '@bxel/project';

const listableUnder = (path: string, root: string): boolean => {
  const inside = path.slice(root.length + 1);
  return inside !== '' && inside.split('/').every(isListableName);
};

export { listableUnder };
