/* @layer renderer-app @kind test */
type Granting = { readonly granted: Set<string> };

const key = (path: string): string => path.replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase();

const parentOf = (path: string): string => path.slice(0, path.lastIndexOf('/'));

const inside = (disk: Granting, path: string): boolean =>
  [...disk.granted].some((root) => key(path) === root || key(path).startsWith(`${root}/`));

const under = (path: string, folder: string): boolean => key(path) === key(folder) || key(path).startsWith(`${key(folder)}/`);

export { inside, key, parentOf, under };
