/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { decodeSprite } from '@bxel/document/native';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';
import { renameAsset } from '../../src/workspace/rename-asset';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { rig } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { artworkOf, openSampleProject, workspaceOf } from './open-sample-project';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

let held: Rig;

beforeEach(() => {
  held = rig();
});

describe('Save all after a rename', () => {
  it('writes the sheets that link the renamed sprite in the same Save all', async () => {
    const { documentId, paths } = await openSampleProject(held);
    const sprite = artworkOf(documentId).sprites[0];
    if (!sprite) throw new Error('no sprite');
    renameAsset(useDocumentStore.getState().host, documentId, { kind: 'sprite', id: sprite.id }, 'hero');
    await saveWorkspace(held.kit, documentId);
    for (const sheet of artworkOf(documentId).sheets) expect(held.disk.writes).toContain(paths.get(sheet.id));
    expect(workspaceOf(documentId).dirty.size).toBe(0);
  });
});

describe('Save all after a shared palette changes', () => {
  it('refreshes the palette copy kept in each sprite file that uses it', async () => {
    const { documentId, paths } = await openSampleProject(held);
    const sprite = artworkOf(documentId).sprites[0];
    const bank = artworkOf(documentId).banks.find((each) => each.id === sprite?.bankId);
    if (!sprite || !bank) throw new Error('no sample');
    const changed = runSteps(useDocumentStore.getState().host, documentId, 'Palette', [
      { name: PALETTE_COMMAND_NAME.rampAdd, targets: null, options: { bankId: bank.id, name: 'glow', swatches: bank.slots.slice(1, 3).map((slot) => slot.id) } },
    ]);
    expect(changed.ok).toBe(true);
    expect([...workspaceOf(documentId).dirty]).toEqual([`palette:${bank.id}`]);
    await saveWorkspace(held.kit, documentId);
    const copy = decodeSprite(held.disk.files.get(paths.get(sprite.id) ?? '') as Uint8Array).slice?.artwork.banks?.[0];
    expect(copy?.ramps.map((ramp) => ramp.name)).toContain('glow');
  });
});

describe('an asset made while Save all is writing', () => {
  it('keeps the path planned for it', async () => {
    const { documentId } = await openSampleProject(held);
    const sprite = artworkOf(documentId).sprites[0];
    if (!sprite) throw new Error('no sprite');
    renameAsset(useDocumentStore.getState().host, documentId, { kind: 'sprite', id: sprite.id }, 'hero');
    const write = held.disk.port.write;
    let made = '';
    vi.spyOn(held.disk.port, 'write').mockImplementation((path, data, options) => {
      if (made === '') {
        const done = runSteps(useDocumentStore.getState().host, documentId, 'Make', [
          { name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'newcomer', width: 8, height: 8, bankId: sprite.bankId } },
        ]);
        made = done.ok ? (artworkOf(documentId).sprites.find((each) => each.name === 'newcomer')?.id ?? 'none') : 'failed';
      }
      return write(path, data, options);
    });
    await saveWorkspace(held.kit, documentId);
    expect(workspaceOf(documentId).paths.has(made)).toBe(true);
  });
});
