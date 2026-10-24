/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type * as EncodeModule from '../../src/workspace/encode-asset';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { rig } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { manyArtwork } from './many-artwork';
import { artworkOf, openSampleProject, workspaceOf } from './open-sample-project';
import { paintSprite } from './workspace-harness';

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

let held: Rig;
const artwork = manyArtwork(ASSETS);

const openMany = async (): ReturnType<typeof openSampleProject> => {
  const opened = await openSampleProject(held, artwork);
  encoded.keys.length = 0;
  return opened;
};

beforeEach(() => {
  held = rig();
});

describe('a project of 200 assets', () => {
  it('opens every asset, clean', async () => {
    const { paths, documentId } = await openMany();
    expect(paths.size).toBe(ASSETS);
    expect(workspaceOf(documentId).paths.size).toBe(ASSETS);
    expect(workspaceOf(documentId).dirty.size).toBe(0);
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
