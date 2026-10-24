/* @layer renderer-app @kind logic */
import { toSlashes } from './to-slashes';

const parentOf = (path: string): string => {
  const slashed = toSlashes(path);
  return slashed.slice(0, Math.max(0, slashed.lastIndexOf('/')));
};

export { parentOf };
