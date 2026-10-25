/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { rig } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { artworkOf, openSampleProject, workspaceOf } from './open-sample-project';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

let held: Rig;

beforeEach(() => {
  held = rig();
});

describe('Save all when the project file cannot be written', () => {
  it('reports the failure and keeps the project settings unsaved', async () => {
    const { documentId } = await openSampleProject(held);
    const cover = artworkOf(documentId).sprites[0];
    if (!cover) throw new Error('no sprite');
    const changed = runSteps(useDocumentStore.getState().host, documentId, 'Cover', [
      { name: COMMAND_NAME.artworkUpdate, targets: null, options: { coverSpriteId: cover.id } },
    ]);
    expect(changed.ok).toBe(true);
    const write = held.disk.port.write;
    vi.spyOn(held.disk.port, 'write').mockImplementation((path, data, options) =>
      path.endsWith('.bxproject') ? Promise.reject(new Error('disk full')) : write(path, data, options),
    );
    const outcome = await saveWorkspace(held.kit, documentId);
    expect(outcome.kind).toBe('failed');
    expect([...workspaceOf(documentId).dirty].some((key) => key.startsWith('project:'))).toBe(true);
  });
});
