/* @layer renderer-app @kind test */
import type { BankId, PaletteBank, SwatchId } from '@bxel/document';
import { RECOVERED_PALETTE_NAME } from '@bxel/document/native';
import { describe, expect, it, vi } from 'vitest';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { encodeAsset } from '../../src/workspace/encode-asset';
import { mapArtwork } from '../project/map-artwork';
import { heldRig } from './held-rig';
import { artworkOf, openSampleProject, workspaceOf } from './open-sample-project';
import { sampleArtwork } from './workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const held = heldRig();

const clock = (): number => 1_700_000_000_000;

const strangerOf = (bank: PaletteBank): PaletteBank => ({
  ...bank,
  id: 'bnk_strangerxxxx' as BankId,
  name: 'Stranger',
  slots: bank.slots.slice(0, 2).map((slot, index) => ({ ...slot, id: `sw_strangerxx0${index}` as SwatchId })),
  ramps: [],
});

const swapInto = (paths: ReadonlyMap<string, string>, moved: string, other: string): void => {
  const { files } = held.rig.disk;
  const old = paths.get(moved) ?? '';
  const otherPath = paths.get(other) ?? '';
  files.set(old.replace(/[^/]+$/, 'moved.bxtiles'), files.get(old) ?? new Uint8Array());
  files.set(old, files.get(otherPath) ?? new Uint8Array());
  files.delete(otherPath);
};

describe('a sprite whose palette link path now holds another palette', () => {
  it('follows the palette id to its new file instead of the stranger at the old path', async () => {
    const artwork = sampleArtwork();
    const bank = artwork.banks[0];
    if (!bank) throw new Error('no bank');
    const stranger = strangerOf(bank);
    const { documentId, paths } = await openSampleProject(held.rig, artwork, (written) => {
      const old = written.get(bank.id) ?? '';
      held.rig.disk.files.set(old.replace(/[^/]+$/, 'moved.bxpalette'), held.rig.disk.files.get(old) ?? new Uint8Array());
      const bytes = encodeAsset({ ...artwork, banks: [stranger] }, { kind: 'palette', id: stranger.id }, new Map([[stranger.id, old]]), { preview: null, clock });
      held.rig.disk.files.set(old, bytes);
    });
    const loaded = artworkOf(documentId);
    const sprite = loaded.sprites[0];
    expect(sprite?.bankId).toBe(bank.id);
    expect(loaded.banks.find((each) => each.id === bank.id)?.slots).toEqual(bank.slots);
    expect(loaded.banks.some((each) => each.name === RECOVERED_PALETTE_NAME)).toBe(false);
    expect(workspaceOf(documentId).paths.get(bank.id)).toBe((paths.get(bank.id) ?? '').replace(/[^/]+$/, 'moved.bxpalette'));
    expect(workspaceOf(documentId).dirty.has(`sprite:${sprite?.id ?? ''}`)).toBe(true);
  });
});

describe('a tilemap whose tileset link path now holds another tileset', () => {
  it('follows the tileset id and opens the map with its own tiles', async () => {
    const artwork = mapArtwork();
    const [ground, secret] = artwork.tilesets;
    const level = artwork.tilemaps.find((each) => each.tilesetId === ground?.id);
    if (!ground || !secret || !level) throw new Error('no maps');
    const { documentId } = await openSampleProject(held.rig, artwork, (paths) => swapInto(paths, ground.id, secret.id));
    const loaded = artworkOf(documentId);
    expect(loaded.tilemaps.find((each) => each.id === level.id)?.tilesetId).toBe(ground.id);
    expect(loaded.tilesets.find((each) => each.id === ground.id)?.tiles).toEqual(ground.tiles);
    expect(useDocumentStore.getState().host.view(documentId)?.state.readOnly).toBe(false);
    expect(workspaceOf(documentId).dirty.has(`tilemap:${level.id}`)).toBe(true);
  });
});
