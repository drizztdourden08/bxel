/* @layer renderer-app @kind logic */
const baseName = (name: string): string => name.slice(name.lastIndexOf('/') + 1).trim();

export { baseName };
