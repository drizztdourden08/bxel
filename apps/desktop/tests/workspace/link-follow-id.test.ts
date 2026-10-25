/* @layer renderer-app @kind test */
import type { BankId, PaletteBank, SwatchId } from '@bxel/document';
import { RECOVERED_PALETTE_NAME } from '@bxel/document/native';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openProject } from '../../src/project/open-project';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { encodeAsset } from '../../src/workspace/encode-asset';
import { mapArtwork } from '../project/map-artwork';
import { rig, ROOT, withManifest } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { artworkOf } from './open-sample-project';
import { sampleArtwork, writeProjectAssets } from './workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

let held: Rig;

const clock = (): number => 1_700_000_000_000;

beforeEach(() => {
  held = rig();
});

describe('a sprite whose palette link path now holds another palette', () => {
  it('follows the palette id to its new file instead of the stranger at the old path', async () => {
    const artwork = sampleArtwork();
    const bank = artwork.banks[0];
    if (!bank) throw new Error('no bank');
    const paths = writeProjectAssets(held.disk, ROOT, artwork);
    const old = paths.get(bank.id) ?? '';
    const moved = old.replace(/[^/]+$/, 'moved.bxpalette');
    held.disk.files.set(moved, held.disk.files.get(old) ?? new Uint8Array());
    const stranger: PaletteBank = { ...bank, id: 'bnk_strangerxxxx' as BankId, name: 'Stranger', slots: bank.slots.slice(0, 2).map((slot, index) => ({ ...slot, id: `sw_strangerxx0${index}` as SwatchId })), ramps: [] };
    const strangerArt = { ...artwork, banks: [stranger] };
    held.disk.files.set(old, encodeAsset(strangerArt, { kind: 'palette', id: stranger.id }, new Map([[stranger.id, old]]), { preview: null, clock }));
    withManifest(held.disk);
    held.disk.picks.folder = ROOT;
    await openProject();
    const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
    if (!workspace) throw new Error('no workspace');
    const loaded = artworkOf(workspace.documentId);
    const sprite = loaded.sprites[0];
    expect(sprite?.bankId).toBe(bank.id);
    expect(loaded.banks.find((each) => each.id === bank.id)?.slots).toEqual(bank.slots);
    expect(loaded.banks.some((each) => each.name === RECOVERED_PALETTE_NAME)).toBe(false);
    expect(workspace.paths.get(bank.id)).toBe(moved);
    expect(workspace.dirty.has(`sprite:${sprite?.id ?? ''}`)).toBe(true);
  });
});

describe('a tilemap whose tileset link path now holds another tileset', () => {
  it('follows the tileset id and opens the map with its own tiles', async () => {
    const artwork = mapArtwork();
    const [ground, secret] = artwork.tilesets;
    const level = artwork.tilemaps.find((each) => each.tilesetId === ground?.id);
    if (!ground || !secret || !level) throw new Error('no maps');
    const paths = writeProjectAssets(held.disk, ROOT, artwork);
    const old = paths.get(ground.id) ?? '';
    held.disk.files.set(old.replace(/[^/]+$/, 'moved.bxtiles'), held.disk.files.get(old) ?? new Uint8Array());
    held.disk.files.set(old, held.disk.files.get(paths.get(secret.id) ?? '') ?? new Uint8Array());
    held.disk.files.delete(paths.get(secret.id) ?? '');
    withManifest(held.disk);
    held.disk.picks.folder = ROOT;
    await openProject();
    const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
    if (!workspace) throw new Error('no workspace');
    const loaded = artworkOf(workspace.documentId);
    const map = loaded.tilemaps.find((each) => each.id === level.id);
    expect(map?.tilesetId).toBe(ground.id);
    expect(loaded.tilesets.find((each) => each.id === ground.id)?.tiles).toEqual(ground.tiles);
    expect(useDocumentStore.getState().host.view(workspace.documentId)?.state.readOnly).toBe(false);
    expect(workspace.dirty.has(`tilemap:${level.id}`)).toBe(true);
  });
});
