/* @layer renderer-app @kind logic */
const normalizeFolder = (input: string): string =>
  input
    .split('/')
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .join('/');

export { normalizeFolder };
