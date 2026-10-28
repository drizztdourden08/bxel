/* @layer renderer-app @kind test */
import type { AssetRow, ListedFile, RowKind } from '../../src/asset-list/asset-list.type';
import { buildItemTree } from '../../src/panel-browser/build-item-tree';
import type { BrowserRoot, ItemTree } from '../../src/panel-browser/project-browser.type';

const ROOT = '/p/demo';
const LINKED = '/p/shared';

const ROOTS: readonly BrowserRoot[] = [
  { path: ROOT, name: 'demo', main: true, granted: true },
  { path: LINKED, name: 'shared', main: false, granted: true },
];

const file = (path: string): ListedFile => ({ path, name: path.split('/').at(-1) ?? path, modified: 100, size: 10 });

const FOLDERS: readonly string[] = [`${ROOT}/sprites`, `${ROOT}/sheets`, `${ROOT}/palettes`, `${LINKED}/tiles`];

const FILES: readonly ListedFile[] = [
  file(`${ROOT}/sprites/hero.bxsprite`),
  file(`${ROOT}/sprites/boss.bxsprite`),
  file(`${ROOT}/sprites/10.bxsprite`),
  file(`${ROOT}/sprites/2.bxsprite`),
  file(`${ROOT}/sheets/all.bxsheet`),
  file(`${ROOT}/palettes/main.bxpalette`),
  file(`${ROOT}/notes.txt`),
  file(`${LINKED}/tiles/grass.bxsprite`),
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

const KIND_OF_ENDING: Readonly<Record<string, RowKind>> = { bxsheet: 'sheet', bxpalette: 'palette', txt: 'other' };

const BASE_ROWS: readonly AssetRow[] = FILES.map((each) => row(KIND_OF_ENDING[each.name.split('.').at(-1) ?? ''] ?? 'sprite', each.path, { loaded: false }));

const treeOf = (rows: readonly AssetRow[] = BASE_ROWS): ItemTree => buildItemTree({ roots: ROOTS, folders: FOLDERS, files: FILES, rows, listed: true });

export { BASE_ROWS, FILES, FOLDERS, LINKED, ROOT, ROOTS, file, row, treeOf };
