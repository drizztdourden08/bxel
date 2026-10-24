/* @layer renderer-app @kind logic */
const toSlashes = (path: string): string => path.replaceAll('\\', '/');

export { toSlashes };
