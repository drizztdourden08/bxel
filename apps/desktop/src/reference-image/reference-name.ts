/* @layer renderer-app @kind logic */
const referenceName = (path: string): string => path.split(/[\\/]/).pop() ?? path;

export { referenceName };
