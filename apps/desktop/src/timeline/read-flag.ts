/* @layer renderer-app @kind logic */

const readFlag = (value: unknown, fallback: boolean): boolean => (typeof value === 'boolean' ? value : fallback);

export { readFlag };
