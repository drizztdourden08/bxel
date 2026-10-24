/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type * as EncodeModule from '../../src/workspace/encode-asset';
import { openProject } from '../../src/project/open-project';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { rig, ROOT, withManifest } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { manyArtwork } from './many-artwork';
import { artworkOf, workspaceOf } from './open-sample-project';
import { paintSprite, writeProjectAssets } from './workspace-harness';

const encoded = vi.hoisted(() => ({ keys: [] as string[] }));

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

vi.mock('../../src/workspace/encode-asset', async (original) => {
  const real = await original<typeof EncodeModule>();
  return {
    encodeAsset: (...args: Parameters<typeof real.encodeAsset>) => {
      encoded.keys.push(args[1].id);
      return real.encodeAsset(...args);
    },
  };
});

const ASSETS = 200;
const OPEN_BUDGET_MS = 4000;

let held: Rig;
const artwork = manyArtwork(ASSETS);

const openMany = async (): Promise<{ readonly paths: ReadonlyMap<string, string>; readonly documentId: ReturnType<typeof workspaceOf>['documentId'] }> => {
  const paths = writeProjectAssets(held.disk, ROOT, artwork);
  withManifest(held.disk);
  held.disk.picks.folder = ROOT;
  await openProject();
  const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
  if (!workspace) throw new Error('the project workspace did not open');
  held.disk.writes.length = 0;
  encoded.keys.length = 0;
  return { paths, documentId: workspace.documentId };
};

beforeEach(() => {
  held = rig();
});

describe('a project of 200 assets', () => {
  it('opens every asset, clean, within the time budget', async () => {
    const paths = writeProjectAssets(held.disk, ROOT, artwork);
    withManifest(held.disk);
    held.disk.picks.folder = ROOT;
    const start = performance.now();
    await openProject();
    const elapsed = performance.now() - start;
    const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
    expect(workspace?.paths.size).toBe(paths.size);
    expect(workspace?.dirty.size).toBe(0);
    expect(elapsed).toBeLessThan(OPEN_BUDGET_MS);
  });

  it('saves one painted asset without encoding any other asset', async () => {
    const { paths, documentId } = await openMany();
    const sprite = artworkOf(documentId).sprites[3];
    if (!sprite) throw new Error('no sprite');
    paintSprite(documentId, sprite.id, 2);
    expect(workspaceOf(documentId).dirty.size).toBe(1);
    await saveWorkspace(held.kit, documentId);
    expect(held.disk.writes).toEqual([paths.get(sprite.id)]);
    expect(encoded.keys).toEqual([sprite.id]);
    expect(workspaceOf(documentId).dirty.size).toBe(0);
  });

  it('judges a stroke and its undo without encoding a single file', async () => {
    const { documentId } = await openMany();
    const sprite = artworkOf(documentId).sprites[5];
    if (!sprite) throw new Error('no sprite');
    paintSprite(documentId, sprite.id, 2);
    expect(workspaceOf(documentId).dirty.size).toBe(1);
    useDocumentStore.getState().host.undo(documentId);
    expect(workspaceOf(documentId).dirty.size).toBe(0);
    expect(encoded.keys).toEqual([]);
  });
});
