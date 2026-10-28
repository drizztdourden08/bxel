/* @layer renderer-app @kind logic */
import { parentOf } from '../workspace/parent-of';
import type { Crumb, SourceRoot } from './project-browser.type';

const same = (left: string, right: string): boolean => left.toLowerCase() === right.toLowerCase();

const rootOf = (roots: readonly SourceRoot[], folder: string): SourceRoot | undefined =>
  roots.find((root) => same(root.path, folder) || folder.toLowerCase().startsWith(`${root.path.toLowerCase()}/`));

/** The path bar: the project, then each folder down to the one shown. A project with one root starts at that root. */
const crumbsOf = (projectName: string, roots: readonly SourceRoot[], folder: string | null): readonly Crumb[] => {
  const single = roots.length === 1 ? roots[0] : undefined;
  const head: Crumb = { label: projectName, path: single?.path ?? null };
  if (folder === null) return [head];
  const root = rootOf(roots, folder);
  if (!root) return [head];
  const steps: Crumb[] = [];
  let at = folder;
  while (!same(at, root.path) && at !== '') {
    steps.unshift({ label: at.split('/').at(-1) ?? at, path: at });
    at = parentOf(at);
  }
  return single ? [head, ...steps] : [head, { label: root.name, path: root.path }, ...steps];
};

const parentFolderOf = (roots: readonly SourceRoot[], folder: string | null): string | null => {
  if (folder === null) return null;
  if (roots.some((root) => same(root.path, folder))) return roots.length === 1 ? null : null;
  return parentOf(folder);
};

export { crumbsOf, parentFolderOf };
