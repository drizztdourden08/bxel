/* @layer renderer-app @kind logic */
import type { TreeNode } from '@drizztdourden08/tessera';
import type { AssetRow } from '../asset-list/asset-list.type';
import { parentOf } from '../workspace/parent-of';
import type { SourceRoot } from './project-browser.type';

type FolderNode = TreeNode<never>;

const same = (left: string, right: string): boolean => left.toLowerCase() === right.toLowerCase();

const filesUnder = (rows: readonly AssetRow[], folder: string): number =>
  rows.filter((row) => row.path !== '' && row.path.toLowerCase().startsWith(`${folder.toLowerCase()}/`)).length;

const branch = (path: string, label: string, folders: readonly string[], rows: readonly AssetRow[], linked: boolean): FolderNode => ({
  key: path,
  label,
  icon: undefined,
  meta: linked ? 'linked' : undefined,
  count: filesUnder(rows, path),
  children: folders
    .filter((each) => same(parentOf(each), path))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' }))
    .map((each) => branch(each, each.split('/').at(-1) ?? each, folders, rows, false)),
  items: [],
});

/** The folders of the project as a tree: the project, its folders as roots, and their folders below. */
const buildFolderTree = (projectName: string, roots: readonly SourceRoot[], folders: readonly string[], rows: readonly AssetRow[]): FolderNode => ({
  key: '',
  label: projectName,
  count: rows.length,
  children: roots.map((root) => branch(root.path, root.name, folders, rows, root.linked)),
  items: [],
});

export { buildFolderTree };
export type { FolderNode };
