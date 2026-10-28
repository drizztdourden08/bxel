/* @layer renderer-app @kind test */
import type { AssetRow, RowKind } from '../../src/asset-list/asset-list.type';
import { buildItemTree } from '../../src/project-browser/build-item-tree';
import type { BrowserEntry, BrowserRoot, ItemTree } from '../../src/project-browser/project-browser.type';

const ROOT = '/p/demo';
const LINKED = '/p/shared';

const ROOTS: readonly BrowserRoot[] = [
  { path: ROOT, name: 'demo', main: true, granted: true },
  { path: LINKED, name: 'shared', main: false, granted: true },
];

const entry = (path: string, isFolder = false, rootPath = ROOT): BrowserEntry => ({
  path,
  name: path.split('/').at(-1) ?? path,
  isFolder,
  size: 10,
  modified: 100,
  rootPath,
});

const ENTRIES: readonly BrowserEntry[] = [
  entry(`${ROOT}/sprites`, true),
  entry(`${ROOT}/sprites/hero.bxsprite`),
  entry(`${ROOT}/sprites/boss.bxsprite`),
  entry(`${ROOT}/sprites/10.bxsprite`),
  entry(`${ROOT}/sprites/2.bxsprite`),
  entry(`${ROOT}/sheets`, true),
  entry(`${ROOT}/sheets/all.bxsheet`),
  entry(`${ROOT}/palettes`, true),
  entry(`${ROOT}/palettes/main.bxpalette`),
  entry(`${ROOT}/notes.txt`),
  entry(`${LINKED}/tiles`, true, LINKED),
  entry(`${LINKED}/tiles/grass.bxsprite`, false, LINKED),
];

const row = (kind: RowKind, path: string, extra: Partial<AssetRow> = {}): AssetRow => ({
  id: path === '' ? `unsaved-${kind}` : path,
  kind,
  assetId: `${kind}-${path.split('/').at(-1) ?? 'x'}`,
  name: (path.split('/').at(-1) ?? 'draft').replace(/\.[^.]+$/, ''),
  path,
  folder: 'f',
  modified: 100,
  created: null,
  dirty: false,
  loaded: true,
  usedBy: [],
  preview: null,
  ...extra,
});

const treeOf = (rows: readonly AssetRow[], entries: readonly BrowserEntry[] = ENTRIES): ItemTree => buildItemTree({ roots: ROOTS, entries, failed: [], rows, listed: true });

export { ENTRIES, LINKED, ROOT, ROOTS, entry, row, treeOf };
