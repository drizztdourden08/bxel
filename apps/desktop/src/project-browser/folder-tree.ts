/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import { parentOf } from '../workspace/parent-of';
import type { Branch, FolderNode, SourceItem, SourceRoot } from './project-browser.type';

const same = (left: string, right: string): boolean => left.toLowerCase() === right.toLowerCase();

const filesUnder = (rows: readonly AssetRow[], folder: string): number =>
  rows.filter((row) => row.path !== '' && row.path.toLowerCase().startsWith(`${folder.toLowerCase()}/`)).length;

const childrenOf = (path: string, folders: readonly string[]): string[] =>
  folders.filter((each) => same(parentOf(each), path)).sort((left, right) => left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' }));

const leafItem = ({ path, label, linked }: Branch, rows: readonly AssetRow[]): SourceItem => ({
  key: path,
  label: linked ? `${label} (linked)` : label,
  icon: linked ? 'link' : 'folder',
  count: filesUnder(rows, path),
});

const layout = (specs: readonly Branch[], folders: readonly string[], rows: readonly AssetRow[]): Pick<FolderNode, 'children' | 'items'> => {
  const hasChildren = (spec: Branch): boolean => childrenOf(spec.path, folders).length > 0;
  return {
    children: specs.filter(hasChildren).map((spec) => branch(spec, folders, rows)),
    items: specs.filter((spec) => !hasChildren(spec)).map((spec) => leafItem(spec, rows)),
  };
};

const branch = (spec: Branch, folders: readonly string[], rows: readonly AssetRow[]): FolderNode => ({
  key: spec.path,
  label: spec.label,
  meta: spec.linked ? 'linked' : undefined,
  count: filesUnder(rows, spec.path),
  ...layout(
    childrenOf(spec.path, folders).map((each): Branch => ({ path: each, label: each.split('/').at(-1) ?? each, linked: false })),
    folders,
    rows,
  ),
});

const buildFolderTree = (projectName: string, roots: readonly SourceRoot[], folders: readonly string[], rows: readonly AssetRow[]): FolderNode => ({
  key: '',
  label: projectName,
  count: rows.length,
  ...layout(roots.map((root): Branch => ({ path: root.path, label: root.name, linked: root.linked })), folders, rows),
});

export { buildFolderTree };
