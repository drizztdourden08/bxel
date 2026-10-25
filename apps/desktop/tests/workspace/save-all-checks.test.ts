/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { readAssetManifest } from '@bxel/document/native';
import { describe, expect, it, vi } from 'vitest';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { runSteps } from '../../src/transactions/run-steps';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { heldRig } from './held-rig';
import { artworkOf, openSampleProject, workspaceOf } from './open-sample-project';
import { paintSprite, sampleArtwork } from './workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const held = heldRig();

const openWithout = async () => {
  const artwork = sampleArtwork();
  const gone = artwork.sprites[0];
  if (!gone) throw new Error('no sprite');
  const opened = await openSampleProject(held.rig, artwork, (paths) => held.rig.disk.files.delete(paths.get(gone.id) ?? ''));
  return { ...opened, gone };
};

describe('Save all with a sheet whose member file is missing', () => {
  it('writes the sheets and keeps the link to the missing file', async () => {
    const { documentId, paths, gone } = await openWithout();
    const sheets = artworkOf(documentId).sheets;
    const outcome = await saveWorkspace(held.rig.kit, documentId);
    expect(outcome.kind).toBe('done');
    for (const sheet of sheets) {
      const bytes = held.rig.disk.files.get(paths.get(sheet.id) ?? '');
      const links = readAssetManifest(bytes as Uint8Array)?.links ?? [];
      expect(links.find((link) => link.id === gone.id)?.path).toBe(`../sprites/${(paths.get(gone.id) ?? '').split('/').pop() ?? ''}`);
    }
  });
});

describe('Save all with a file that cannot be written', () => {
  it('checks every file first and writes none of them', async () => {
    const { documentId } = await openSampleProject(held.rig);
    const [linked, painted] = artworkOf(documentId).sprites;
    const sheet = artworkOf(documentId).sheets[0];
    if (!linked || !painted || !sheet) throw new Error('no sample');
    paintSprite(documentId, painted.id);
    useWorkspaceStore.getState().patch(documentId, (workspace) => {
      const paths = new Map(workspace.paths);
      paths.delete(linked.id);
      return { ...workspace, paths, dirty: new Set([...workspace.dirty, `sheet:${sheet.id}`]) };
    });
    const outcome = await saveWorkspace(held.rig.kit, documentId);
    expect(outcome.kind).toBe('failed');
    expect(held.rig.disk.writes).toEqual([]);
    expect(workspaceOf(documentId).dirty.has(`sprite:${painted.id}`)).toBe(true);
  });
});

describe('Save all when the project file cannot be written', () => {
  it('reports the failure and keeps the project settings unsaved', async () => {
    const { documentId } = await openSampleProject(held.rig);
    const cover = artworkOf(documentId).sprites[0];
    if (!cover) throw new Error('no sprite');
    const changed = runSteps(useDocumentStore.getState().host, documentId, 'Cover', [
      { name: COMMAND_NAME.artworkUpdate, targets: null, options: { coverSpriteId: cover.id } },
    ]);
    expect(changed.ok).toBe(true);
    const write = held.rig.disk.port.write;
    vi.spyOn(held.rig.disk.port, 'write').mockImplementation((path, data, options) =>
      path.endsWith('.bxproject') ? Promise.reject(new Error('disk full')) : write(path, data, options),
    );
    const outcome = await saveWorkspace(held.rig.kit, documentId);
    expect(outcome.kind).toBe('failed');
    expect([...workspaceOf(documentId).dirty].some((key) => key.startsWith('project:'))).toBe(true);
  });
});
