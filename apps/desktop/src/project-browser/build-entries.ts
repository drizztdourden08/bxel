/* @layer renderer-app @kind logic */
import type { AssetKey } from '@bxel/document';
import type { AssetRow } from '../asset-list/asset-list.type';
import { parentOf } from '../workspace/parent-of';
import { isSearching } from './parse-query';
import { matchEntry } from './match-entry';
import { NO_FACTS } from './row-facts';
import { sortEntries } from './sort-entries';
import type { BrowserEntry, BrowserFacts, BrowserQuery, BrowserSort, FileEntry, FolderEntry, SourceRoot } from './project-browser.type';

type EntryInput = {
  readonly rows: readonly AssetRow[];
  readonly facts: ReadonlyMap<string, BrowserFacts>;
  readonly keys: ReadonlyMap<string, AssetKey>;
  readonly roots: readonly SourceRoot[];
  readonly folders: readonly string[];
  readonly folder: string | null;
  readonly query: BrowserQuery;
  readonly pinned: ReadonlySet<string>;
  readonly sort: BrowserSort;
};

const same = (left: string, right: string): boolean => left.toLowerCase() === right.toLowerCase();

const under = (path: string, folder: string): boolean => path.toLowerCase().startsWith(`${folder.toLowerCase()}/`);

const fileEntry = (row: AssetRow, input: EntryInput): FileEntry => ({
  kind: 'file',
  id: row.id,
  row,
  facts: input.facts.get(row.id) ?? NO_FACTS,
  pinned: input.pinned.has(row.id),
  key: input.keys.get(row.id) ?? null,
});

const homeOf = (row: AssetRow, roots: readonly SourceRoot[]): string => (row.path === '' ? (roots[0]?.path ?? '') : parentOf(row.path));

const countUnder = (rows: readonly AssetRow[], folder: string): number => rows.filter((row) => row.path !== '' && under(row.path, folder)).length;

const folderEntry = (path: string, input: EntryInput, root: SourceRoot | undefined): FolderEntry => ({
  kind: 'folder',
  id: path,
  path,
  name: root?.name ?? path.split('/').at(-1) ?? path,
  count: countUnder(input.rows, path),
  root: root !== undefined,
  linked: root?.linked ?? false,
});

const childFolders = (input: EntryInput, folder: string): string[] => {
  const known = [...input.folders, ...input.rows.filter((row) => row.path !== '').map((row) => parentOf(row.path))];
  const found = new Map<string, string>();
  for (const path of known) {
    let at = path;
    while (at !== '' && under(at, folder)) {
      if (same(parentOf(at), folder)) found.set(at.toLowerCase(), at);
      at = parentOf(at);
    }
  }
  return [...found.values()];
};

/** What the centre of the Browse page lists: a folder, the roots of the project, or the hits of a search. */
const buildEntries = (input: EntryInput): readonly BrowserEntry[] => {
  if (isSearching(input.query)) {
    const hits = input.rows.map((row) => fileEntry(row, input)).filter((entry) => matchEntry(entry, input.query));
    return sortEntries(hits, input.sort);
  }
  if (input.folder === null) return sortEntries(input.roots.map((root) => folderEntry(root.path, input, root)), input.sort);
  const folder = input.folder;
  const files = input.rows.filter((row) => same(homeOf(row, input.roots), folder)).map((row) => fileEntry(row, input));
  const folders = childFolders(input, folder).map((path) => folderEntry(path, input, undefined));
  return sortEntries([...folders, ...files], input.sort);
};

export { buildEntries };
export type { EntryInput };
