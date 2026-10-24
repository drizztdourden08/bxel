/* @layer renderer-app @kind test */
import { decodeSprite } from '@bxel/document/native';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { runSteps } from '../../src/transactions/run-steps';
import { saveActiveAsset } from '../../src/workspace/save-active-asset';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { COMMAND_NAME } from '@bxel/document';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { rig, ROOT } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { confirmAction } from '../project/project-mocks';
import { artworkOf, openSampleProject, workspaceOf } from './open-sample-project';
import { paintSprite } from './workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

let held: Rig;

const opened = () => openSampleProject(held);


const paintedFirst = async () => {
  const { documentId } = await opened();
  const sprite = artworkOf(documentId).sprites[0];
  if (!sprite) throw new Error('no sprite');
  paintSprite(documentId, sprite.id);
  return { documentId, sprite };
};

beforeEach(() => {
  held = rig();
});

describe('opening a project', () => {
  it('loads every asset of the project into one workspace, with nothing dirty', async () => {
    const { artwork, paths, documentId } = await opened();
    const loaded = artworkOf(documentId);
    expect(loaded.sprites.map((sprite) => sprite.id).sort()).toEqual(artwork.sprites.map((sprite) => sprite.id).sort());
    expect(loaded.sheets.map((sheet) => sheet.name).sort()).toEqual(['idle', 'walk']);
    expect(loaded.banks.map((bank) => bank.id)).toEqual(artwork.banks.map((bank) => bank.id));
    const byId = (left: { id: string }, right: { id: string }): number => left.id.localeCompare(right.id);
    expect([...loaded.sprites].sort(byId)).toEqual([...artwork.sprites].sort(byId));
    expect([...loaded.sheets].sort(byId)).toEqual([...artwork.sheets].sort(byId));
    expect(workspaceOf(documentId).paths).toEqual(paths);
    expect(workspaceOf(documentId).dirty.size).toBe(0);
    expect(useWorkspaceStore.getState().loading).toBeNull();
  });

  it('skips the exports folder', async () => {
    held.disk.dirs.add(`${ROOT}/exports`);
    held.disk.files.set(`${ROOT}/exports/copy.bxsprite`, new Uint8Array(4));
    const { documentId } = await opened();
    expect([...workspaceOf(documentId).paths.values()].some((path) => path.includes('/exports/'))).toBe(false);
  });
});

describe('a sprite used by two sheets', () => {
  it('is one sprite in memory: painting it changes what both sheets show and dirties only the sprite', async () => {
    const { documentId, sprite } = await paintedFirst();
    const after = artworkOf(documentId);
    const placed = (sheet: (typeof after.sheets)[number]): boolean => sheet.entries.some((entry) => entry.spriteId === sprite.id);
    expect(after.sheets.every(placed)).toBe(true);
    expect(after.sprites.filter((each) => each.id === sprite.id)).toHaveLength(1);
    expect([...workspaceOf(documentId).dirty]).toEqual([`sprite:${sprite.id}`]);
  });

  it('is clean again when the paint is undone', async () => {
    const { documentId } = await paintedFirst();
    useDocumentStore.getState().host.undo(documentId);
    expect(workspaceOf(documentId).dirty.size).toBe(0);
  });
});

describe('saving a project workspace', () => {
  it('Save all writes only the dirty files, and the file reads back with the paint', async () => {
    const { paths, documentId } = await opened();
    const sprite = artworkOf(documentId).sprites[1];
    if (!sprite) throw new Error('no sprite');
    paintSprite(documentId, sprite.id, 2);
    const outcome = await saveWorkspace(held.kit, documentId);
    expect(outcome.kind).toBe('done');
    expect(held.disk.writes).toEqual([paths.get(sprite.id)]);
    expect(workspaceOf(documentId).dirty.size).toBe(0);
    const bytes = held.disk.files.get(paths.get(sprite.id) ?? '');
    expect(decodeSprite(bytes as Uint8Array).slice?.artwork.sprites?.[0]?.layers).toEqual(artworkOf(documentId).sprites[1]?.layers);
  });

  it('Save writes the active asset only', async () => {
    const { paths, documentId } = await opened();
    const [first, second] = artworkOf(documentId).sprites;
    if (!first || !second) throw new Error('no sprites');
    paintSprite(documentId, first.id);
    paintSprite(documentId, second.id);
    useWorkspaceStore.getState().setActiveTab(`${documentId}|sprite:${second.id}`);
    useWorkspaceStore.getState().addTab({ id: `${documentId}|sprite:${second.id}`, documentId, key: { kind: 'sprite', id: second.id } });
    await saveActiveAsset(held.kit, false);
    expect(held.disk.writes).toEqual([paths.get(second.id)]);
    expect([...workspaceOf(documentId).dirty]).toEqual([`sprite:${first.id}`]);
  });

  it('moves the file of a deleted sprite to the trash at Save all, after one confirmation', async () => {
    const { paths, documentId } = await opened();
    const lone = artworkOf(documentId).sprites[1];
    if (!lone) throw new Error('no sprite');
    const host = useDocumentStore.getState().host;
    const removed = runSteps(host, documentId, 'Remove', [
      ...artworkOf(documentId).sheets.map((sheet) => ({ name: COMMAND_NAME.sheetRemove, targets: spritesTarget([lone.id]), options: { sheet: sheet.id } })),
      { name: COMMAND_NAME.spriteDelete, targets: spritesTarget([lone.id]), options: {} },
    ]);
    expect(removed.ok).toBe(true);
    await saveWorkspace(held.kit, documentId);
    expect(confirmAction).toHaveBeenCalledTimes(1);
    expect(held.disk.trashed).toEqual([paths.get(lone.id)]);
    expect(workspaceOf(documentId).paths.has(lone.id)).toBe(false);
    expect(workspaceOf(documentId).dirty.size).toBe(0);
  });
});

describe('undo in a project', () => {
  it('names the asset and switches to its tab', async () => {
    const { documentId } = await opened();
    const [first, second] = artworkOf(documentId).sprites;
    if (!first || !second) throw new Error('no sprites');
    paintSprite(documentId, first.id);
    expect(workspaceOf(documentId).steps.undo.at(-1)).toBe(first.name);
    useWorkspaceStore.getState().setActiveTab(`${documentId}|sprite:${second.id}`);
    useDocumentStore.getState().host.undo(documentId);
    expect(useWorkspaceStore.getState().activeTab).toBe(`${documentId}|sprite:${first.id}`);
    expect(workspaceOf(documentId).steps.redo).toEqual([first.name]);
  });
});
