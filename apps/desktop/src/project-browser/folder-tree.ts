/* @layer renderer-app @kind logic */
import type { AssetRow } from '../asset-list/asset-list.type';
import { parentOf } from '../workspace/parent-of';
import type { Branch, FolderNode, SourceRoot } from './project-browser.type';

const same = (left: string, right: string): boolean => left.toLowerCase() === right.toLowerCase();

const filesUnder = (rows: readonly AssetRow[], folder: string): number =>
  rows.filter((row) => row.path !== '' && row.path.toLowerCase().startsWith(`${folder.toLowerCase()}/`)).length;

const branch = ({ path, label, linked }: Branch, folders: readonly string[], rows: readonly AssetRow[]): FolderNode => ({
  key: path,
  label,
  icon: undefined,
  meta: linked ? 'linked' : undefined,
  count: filesUnder(rows, path),
  children: folders
    .filter((each) => same(parentOf(each), path))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' }))
    .map((each) => branch({ path: each, label: each.split('/').at(-1) ?? each, linked: false }, folders, rows)),
  items: [],
});

const buildFolderTree = (projectName: string, roots: readonly SourceRoot[], folders: readonly string[], rows: readonly AssetRow[]): FolderNode => ({
  key: '',
  label: projectName,
  count: rows.length,
  children: roots.map((root) => branch({ path: root.path, label: root.name, linked: root.linked }, folders, rows)),
  items: [],
});

export { buildFolderTree };
