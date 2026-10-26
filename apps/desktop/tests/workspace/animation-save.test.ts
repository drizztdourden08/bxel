/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { decodeAnimation } from '@bxel/document/native';
import { describe, expect, it, vi } from 'vitest';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';
import { focusTab } from '../../src/workspace/focus-tab';
import { saveActiveAsset } from '../../src/workspace/save-active-asset';
import { tabOf } from '../../src/workspace/tab-of';
import { ROOT } from '../project/project-harness';
import { heldRig } from './held-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const held = heldRig();

describe('saving an animation of a loose document', () => {
  it('asks for a .bxanim path, writes the animation and keeps its own frames inside the file', async () => {
    const { host } = useDocumentStore.getState();
    const documentId = createDefaultArtwork(host);
    useDocumentStore.getState().setActive(documentId);
    const made = runSteps(host, documentId, 'Animation', [
      { name: COMMAND_NAME.animationCreate, targets: null, options: { name: 'walk', source: { kind: 'blank', width: 8, height: 8, frames: 2 } }, ref: 'anim' },
      { name: COMMAND_NAME.animationFrameOwn, targets: null, options: { animation: { ref: 'anim' }, frame: { by: 'index', index: 0 } } },
      { name: COMMAND_NAME.animationFrameOwn, targets: null, options: { animation: { ref: 'anim' }, frame: { by: 'index', index: 1 } } },
    ]);
    if (!made.ok) throw new Error(made.error.message);
    focusTab(tabOf(documentId, { kind: 'animation', id: made.created['anim'] ?? '' }));
    held.rig.disk.granted.add(ROOT.toLowerCase());
    held.rig.disk.dirs.add(ROOT);
    const path = `${ROOT}/walk.bxanim`;
    vi.spyOn(held.rig.disk.port, 'saveAs').mockImplementation(() => Promise.resolve({ path, folderGranted: false }) as never);
    const outcome = await saveActiveAsset(held.rig.kit, true);
    expect(outcome).toMatchObject({ kind: 'done', path });
    const report = decodeAnimation(held.rig.disk.files.get(path) as Uint8Array);
    expect(report.slice?.artwork.animations?.[0]?.frames).toHaveLength(2);
    expect(report.slice?.artwork.sprites?.filter((sprite) => sprite.role === 'frame')).toHaveLength(2);
  });
});
