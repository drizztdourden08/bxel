/* @layer renderer-app @kind test */
import type { Artwork } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recentIdOf } from '../../src/assistant/tools/recent-id-of';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { paintSprite, sampleArtwork, writeProjectAssets } from '../workspace/workspace-harness';
import { key } from './disk-paths';
import { openSharedRig, SHARED, workspaceDocumentId } from './hidden-folder-rig';
import type { Disk } from './memory-disk';
import { ROOT } from './project-harness';
import { rowsOf } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let current: ToolRig;
let artwork: Artwork;

const HIDDEN = `${SHARED}/hidden.bxsprite`;

const FREE = 'C:/Elsewhere/free.bxsprite';

const spriteAt = (at: number) => {
  const found = artwork.sprites[at];
  if (!found) throw new Error('no sprite');
  return found;
};

const seed = (disk: Disk): void => {
  writeProjectAssets(disk, ROOT, artwork, new Map([[spriteAt(0).id, HIDDEN]]));
  disk.dirs.add(SHARED);
  disk.granted.add(key(SHARED));
};

const recents = (...paths: readonly string[]): void => {
  const entries = paths.map((path) => ({ path, name: path.slice(path.lastIndexOf('/') + 1), lastOpened: 1_700_000_000_000 }));
  vi.spyOn(current.rig.disk.port, 'recent').mockResolvedValue(entries);
};

const recentNames = async (grants: ReturnType<ToolRig['grants']>): Promise<unknown[]> =>
  rowsOf(await current.run('list_places', {}, grants), 'recent').map((row) => row.fileName);

beforeEach(async () => {
  artwork = sampleArtwork();
  current = await openSharedRig(seed);
});

describe('recent files', () => {
  it('leaves out a file in a folder the assistant may not see', async () => {
    recents(HIDDEN, FREE);
    expect(await recentNames(current.grants('edit'))).toEqual(['free.bxsprite']);
    const opened = await current.run('open_file', { file: { recentId: recentIdOf(HIDDEN) }, activate: false }, current.grants('edit'));
    expect(opened).toMatchObject({ ok: false, error: { code: 'FILE_NOT_FOUND' } });
  });

  it('leaves out every file of a project the owner has not granted', async () => {
    recents(HIDDEN, `${ROOT}/sprites/slime.bxsprite`, FREE);
    expect(await recentNames([])).toEqual(['free.bxsprite']);
    const opened = await current.run('open_file', { file: { recentId: recentIdOf(`${ROOT}/sprites/slime.bxsprite`) }, activate: false }, []);
    expect(opened).toMatchObject({ ok: false, error: { code: 'FILE_NOT_FOUND' } });
  });

  it('keeps a file of a project the assistant may look at', async () => {
    recents(`${ROOT}/sprites/slime.bxsprite`, FREE);
    expect(await recentNames(current.grants('read'))).toEqual(['slime.bxsprite', 'free.bxsprite']);
  });
});

describe('Save all by the assistant', () => {
  const saveAll = () => current.run('save_document', { documentId: workspaceDocumentId(), target: 'current' }, current.grants('edit'));

  it('does not write an owner asset in a hidden folder, and does not name it', async () => {
    paintSprite(workspaceDocumentId(), spriteAt(0).id);
    paintSprite(workspaceDocumentId(), spriteAt(1).id);
    current.rig.disk.writes.length = 0;
    const saved = await saveAll();
    expect(saved).toMatchObject({ ok: true });
    expect(current.rig.disk.writes).not.toContain(HIDDEN);
    expect(current.rig.disk.writes.length).toBeGreaterThan(0);
    expect(JSON.stringify(saved)).not.toContain('hidden.bxsprite');
    expect(useWorkspaceStore.getState().workspaces[workspaceDocumentId()]?.dirty.has(`sprite:${spriteAt(0).id}`)).toBe(true);
  });

  it('writes nothing when only the hidden asset is dirty', async () => {
    paintSprite(workspaceDocumentId(), spriteAt(0).id);
    current.rig.disk.writes.length = 0;
    const saved = await saveAll();
    expect(saved).toMatchObject({ ok: true });
    expect(current.rig.disk.writes).toEqual([]);
    expect(JSON.stringify(saved)).not.toContain('hidden.bxsprite');
  });
});
