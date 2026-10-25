/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { BankId, DocumentId } from '@bxel/document';
import { decodeSprite } from '@bxel/document/native';
import { describe, expect, it, vi } from 'vitest';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';
import { renameAsset } from '../../src/workspace/rename-asset';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { heldRig } from './held-rig';
import { artworkOf, openSampleProject, spriteAndBank, workspaceOf } from './open-sample-project';
import { addRamp } from './workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const held = heldRig();

const newcomer = (documentId: DocumentId, bankId: BankId): string => {
  const done = runSteps(useDocumentStore.getState().host, documentId, 'Make', [
    { name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'newcomer', width: 8, height: 8, bankId } },
  ]);
  return done.ok ? (artworkOf(documentId).sprites.find((each) => each.name === 'newcomer')?.id ?? 'none') : 'failed';
};

const renamedFirst = async () => {
  const opened = await openSampleProject(held.rig);
  const sprite = artworkOf(opened.documentId).sprites[0];
  if (!sprite) throw new Error('no sprite');
  renameAsset(useDocumentStore.getState().host, opened.documentId, { kind: 'sprite', id: sprite.id }, 'hero');
  return { ...opened, sprite };
};

describe('Save all after a rename', () => {
  it('writes the sheets that link the renamed sprite in the same Save all', async () => {
    const { documentId, paths } = await renamedFirst();
    await saveWorkspace(held.rig.kit, documentId);
    for (const sheet of artworkOf(documentId).sheets) expect(held.rig.disk.writes).toContain(paths.get(sheet.id));
    expect(workspaceOf(documentId).dirty.size).toBe(0);
  });
});

describe('Save all after a shared palette changes', () => {
  it('refreshes the palette copy kept in each sprite file that uses it', async () => {
    const { documentId, paths } = await openSampleProject(held.rig);
    const { sprite, bank } = spriteAndBank(documentId);
    expect(addRamp(documentId, bank, 'glow')).toBe(true);
    expect([...workspaceOf(documentId).dirty]).toEqual([`palette:${bank.id}`]);
    await saveWorkspace(held.rig.kit, documentId);
    const copy = decodeSprite(held.rig.disk.files.get(paths.get(sprite.id) ?? '') as Uint8Array).slice?.artwork.banks?.[0];
    expect(copy?.ramps.map((ramp) => ramp.name)).toContain('glow');
  });
});

describe('an asset made while Save all is writing', () => {
  it('keeps the path planned for it', async () => {
    const { documentId, sprite } = await renamedFirst();
    const write = held.rig.disk.port.write;
    let made = '';
    vi.spyOn(held.rig.disk.port, 'write').mockImplementation((path, data, options) => {
      if (made === '') made = newcomer(documentId, sprite.bankId);
      return write(path, data, options);
    });
    await saveWorkspace(held.rig.kit, documentId);
    expect(workspaceOf(documentId).paths.has(made)).toBe(true);
  });
});
