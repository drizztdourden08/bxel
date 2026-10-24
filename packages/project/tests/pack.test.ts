/* @layer tests @kind test */
import { packProject, PROJECT_ERROR_CODE, unpackProject } from '@bxel/project';
import type { FolderLocation, ProjectDocument } from '@bxel/project';
import { describe, expect, it } from 'vitest';
import { roundTrip } from './pack-round-trip';
import { sampleDocument } from './sample-document';

const ROOT = 'fld_7r2k9m4q';
const SHARED = 'fld_3m8q2k7x';

const NATIVE: readonly (readonly [string, number])[] = [
  [`${ROOT}/palettes/dawn.bxpalette`, 4],
  [`${ROOT}/sheets/main.bxsheet`, 3],
  [`${ROOT}/sprites/boss/orc.bxsprite`, 2],
  [`${ROOT}/sprites/hero.bxsprite`, 1],
  [`${ROOT}/tilemaps/level1.bxmap`, 5],
  [`${ROOT}/tilemaps/set.bxtiles`, 6],
  [`${SHARED}/dawn.bxpalette`, 10],
];

const OTHER: readonly (readonly [string, number])[] = [
  [`${ROOT}/exports/hero.png`, 7],
  [`${ROOT}/exports/leftover.bxsprite`, 8],
  [`${ROOT}/notes.txt`, 9],
];

const tree = (): ReadonlyMap<string, Uint8Array> =>
  new Map([...NATIVE, ...OTHER].map(([key, byte]) => [key, Uint8Array.from([byte])]));

const at = (folderId: string, path: string): FolderLocation => ({ folderId: folderId as FolderLocation['folderId'], path });

const listed = (files: ReadonlyMap<string, Uint8Array>): FolderLocation[] =>
  [...files.keys()].map((key) => at(key.slice(0, key.indexOf('/')), key.slice(key.indexOf('/') + 1)));

const packed = (manifest: ProjectDocument = sampleDocument()) => {
  const planned = packProject(manifest, listed(tree()));
  if (!planned.ok) throw new Error(planned.message);
  return planned.value;
};

describe('pack', () => {
  it('adds every native asset under every folder as assets/<folder>/<path> and nothing else', () => {
    const plan = packed();
    expect(plan.operations.map((operation) => operation.entry)).toEqual([
      'assets/Dungeon/palettes/dawn.bxpalette',
      'assets/Dungeon/sheets/main.bxsheet',
      'assets/Dungeon/sprites/boss/orc.bxsprite',
      'assets/Dungeon/sprites/hero.bxsprite',
      'assets/Dungeon/tilemaps/level1.bxmap',
      'assets/Dungeon/tilemaps/set.bxtiles',
      'assets/Shared/dawn.bxpalette',
    ]);
    expect(plan.operations.map((operation) => `${operation.from.folderId}/${operation.from.path}`)).toEqual(NATIVE.map(([key]) => key));
    expect(plan.skipped).toEqual([]);
  });

  it('turns the access off and drops machine paths in the packed manifest', () => {
    const { manifest } = packed();
    expect(manifest.assistant.access).toBe('off');
    expect(manifest.folders.map((folder) => folder.path)).toEqual(['.', 'assets/Shared']);
  });

  it('skips a native file whose path breaks the rules or whose folder is unknown, and counts a name once', () => {
    const plan = packProject(sampleDocument(), [
      at(ROOT, 'sprites/a b?.bxsprite'),
      at('fld_zzzzzzzz', 'x.bxsprite'),
      at(ROOT, 'sprites/hero.bxsprite'),
      at(ROOT, 'sprites/HERO.bxsprite'),
    ]);
    expect(plan.ok && plan.value.operations).toHaveLength(1);
    expect(plan.ok && plan.value.skipped.map((each) => each.path)).toEqual(['sprites/a b?.bxsprite', 'x.bxsprite']);
  });

  it('refuses more assets than the cap', () => {
    const many = Array.from({ length: 2001 }, (_unused, index) => at(ROOT, `sprites/s${index}.bxsprite`));
    const plan = packProject(sampleDocument(), many);
    expect(plan.ok).toBe(false);
    if (!plan.ok) expect(plan.code).toBe(PROJECT_ERROR_CODE.TOO_MANY_ASSETS);
  });

  it('keeps the folder directories apart when two folders share a name', () => {
    const [root, shared] = sampleDocument().folders;
    if (!root || !shared) throw new Error('The sample has two folders.');
    const entries = packed({ ...sampleDocument(), folders: [root, { ...shared, name: 'dungeon' }] }).operations.map((operation) => operation.entry);
    expect(entries.some((entry) => entry.startsWith('assets/Dungeon/'))).toBe(true);
    expect(entries.some((entry) => entry.startsWith('assets/dungeon 2/'))).toBe(true);
  });
});

describe('pack then unpack', () => {
  it('reproduces the tree', () => {
    const files = tree();
    const { rebuilt, orphans } = roundTrip(files, 'C:/Work/Out');
    expect([...rebuilt.keys()].sort()).toEqual(NATIVE.map(([key]) => key).sort());
    for (const [key] of NATIVE) expect(rebuilt.get(key)).toEqual(files.get(key));
    expect(orphans).toEqual([]);
  });

  it('puts the root folder and its siblings under the destination and turns the grant off', () => {
    const { unpack } = roundTrip(tree(), 'C:/Work/Out');
    expect(unpack.skipped).toEqual([]);
    expect(unpack.root).toBe('C:/Work/Out/Dungeon');
    expect(unpack.projectFile).toBe('C:/Work/Out/Dungeon/Dungeon.bxproject');
    expect(unpack.manifest.folders.map((folder) => folder.path)).toEqual(['.', '../Shared']);
    expect(unpack.manifest.assistant.access).toBe('off');
  });

  it('skips entries that are not native assets of a project folder', () => {
    const entries = [
      'assets/Dungeon/sprites/hero.bxsprite',
      'assets/Dungeon/../x.bxsprite',
      'assets/Nowhere/a.bxsprite',
      'assets/Dungeon/readme.txt',
      'other.bxsprite',
    ];
    const unpack = unpackProject(sampleDocument(), entries, 'C:/Work/Out');
    expect(unpack.ok && unpack.value.operations.filter((operation) => operation.kind === 'extract')).toHaveLength(1);
    expect(unpack.ok && unpack.value.skipped).toHaveLength(4);
  });

  it('refuses a destination that is not absolute', () => {
    expect(unpackProject(sampleDocument(), [], 'Out/here').ok).toBe(false);
  });
});
