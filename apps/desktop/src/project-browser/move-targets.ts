/* @layer renderer-app @kind logic */
import type { MoveTarget } from '../stores/move-to-store.type';
import { toSlashes } from '../workspace/to-slashes';
import type { SourceRoot } from './project-browser.type';

const lower = (path: string): string => toSlashes(path).toLowerCase();

const blocked = (path: string, moving: readonly string[]): boolean => moving.some((each) => lower(path) === lower(each) || lower(path).startsWith(`${lower(each)}/`));

const labelOf = (path: string, roots: readonly SourceRoot[]): string => {
  const root = roots.find((each) => lower(path) === lower(each.path) || lower(path).startsWith(`${lower(each.path)}/`));
  if (root === undefined) return toSlashes(path);
  return `${root.name}${toSlashes(path).slice(toSlashes(root.path).length)}`;
};

const moveTargets = (roots: readonly SourceRoot[], folders: readonly string[], moving: readonly string[]): readonly MoveTarget[] => {
  const all = new Map([...roots.map((root) => root.path), ...folders].map((path) => [lower(path), toSlashes(path)] as const));
  return [...all.values()]
    .filter((path) => !blocked(path, moving))
    .map((path) => ({ path, label: labelOf(path, roots) }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export { moveTargets };
