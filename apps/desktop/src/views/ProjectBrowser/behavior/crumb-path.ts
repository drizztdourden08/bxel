/* @layer renderer-app @kind logic */
const crumbPath = (id: string): string | null => (id === '' ? null : id);

export { crumbPath };
