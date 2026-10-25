/* @layer renderer-app @kind test */
import { readAssetManifest } from '@bxel/document/native';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { rig, ROOT, withManifest } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { openProject } from '../../src/project/open-project';
import { artworkOf, openSampleProject, workspaceOf } from './open-sample-project';
import { paintSprite, sampleArtwork, writeProjectAssets } from './workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

let held: Rig;

const openWithout = async () => {
  const artwork = sampleArtwork();
  const paths = writeProjectAssets(held.disk, ROOT, artwork);
  const gone = artwork.sprites[0];
  if (!gone) throw new Error('no sprite');
  const missing = paths.get(gone.id) ?? '';
  held.disk.files.delete(missing);
  withManifest(held.disk);
  held.disk.picks.folder = ROOT;
  await openProject();
  const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
  if (!workspace) throw new Error('no workspace');
  held.disk.writes.length = 0;
  return { documentId: workspace.documentId, paths, gone, missing };
};

beforeEach(() => {
  held = rig();
});

describe('Save all with a sheet whose member file is missing', () => {
  it('writes the sheets and keeps the link to the missing file', async () => {
    const { documentId, paths, gone } = await openWithout();
    const sheets = artworkOf(documentId).sheets;
    const outcome = await saveWorkspace(held.kit, documentId);
    expect(outcome.kind).toBe('done');
    for (const sheet of sheets) {
      const bytes = held.disk.files.get(paths.get(sheet.id) ?? '');
      const links = readAssetManifest(bytes as Uint8Array)?.links ?? [];
      expect(links.find((link) => link.id === gone.id)?.path).toBe(`../sprites/${(paths.get(gone.id) ?? '').split('/').pop() ?? ''}`);
    }
  });
});

describe('Save all with a file that cannot be written', () => {
  it('checks every file first and writes none of them', async () => {
    const { documentId } = await openSampleProject(held);
    const [linked, painted] = artworkOf(documentId).sprites;
    const sheet = artworkOf(documentId).sheets[0];
    if (!linked || !painted || !sheet) throw new Error('no sample');
    paintSprite(documentId, painted.id);
    useWorkspaceStore.getState().patch(documentId, (workspace) => {
      const paths = new Map(workspace.paths);
      paths.delete(linked.id);
      return { ...workspace, paths, dirty: new Set([...workspace.dirty, `sheet:${sheet.id}`]) };
    });
    const outcome = await saveWorkspace(held.kit, documentId);
    expect(outcome.kind).toBe('failed');
    expect(held.disk.writes).toEqual([]);
    expect(workspaceOf(documentId).dirty.has(`sprite:${painted.id}`)).toBe(true);
  });
});
