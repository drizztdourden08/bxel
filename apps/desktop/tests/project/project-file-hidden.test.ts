/* @layer renderer-app @kind test */
import type { Artwork } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sampleArtwork, writeProjectAssets } from '../workspace/workspace-harness';
import { key } from './disk-paths';
import { openSharedRig, SHARED } from './hidden-folder-rig';
import type { Disk } from './memory-disk';
import { ROOT } from './project-harness';
import { fieldOf, rowsOf } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let current: ToolRig;
let artwork: Artwork;
let paths: ReadonlyMap<string, string>;

const seed = (disk: Disk): void => {
  const sheet = artwork.sheets[0];
  paths = writeProjectAssets(disk, ROOT, artwork, new Map([[sheet?.id ?? '', `${SHARED}/hidden-sheet.bxsheet`]]));
  disk.dirs.add(SHARED);
  disk.dirs.add(`${ROOT}/heroes`);
  disk.granted.add(key(SHARED));
};

const spritePath = (): string => paths.get(artwork.sprites[0]?.id ?? '') ?? '';

const errorCode = (outcome: Awaited<ReturnType<ToolRig['run']>>): string => (outcome.ok ? 'ok' : outcome.error.code);

beforeEach(async () => {
  artwork = sampleArtwork();
  current = await openSharedRig(seed);
});

describe('the project file tools and a folder the assistant cannot see', () => {
  it('refuses to move a file that a hidden file links to, and changes nothing', async () => {
    const outcome = await current.run('move_files', { projectId: current.projectId, files: [{ folderId: current.folderId, path: spritePath().slice(ROOT.length + 1) }], into: { folderId: current.folderId, path: 'heroes' } }, current.grants('edit'));
    expect(errorCode(outcome)).toBe('PATH_NOT_ALLOWED');
    expect(current.rig.disk.files.has(spritePath())).toBe(true);
    expect(current.rig.disk.renamed).toEqual([]);
  });

  it('refuses to trash such a file even with breakLinks', async () => {
    const outcome = await current.run('trash_files', { projectId: current.projectId, files: [{ folderId: current.folderId, path: spritePath().slice(ROOT.length + 1) }], breakLinks: true }, current.grants('edit'));
    expect(errorCode(outcome)).toBe('PATH_NOT_ALLOWED');
    expect(current.rig.disk.trashed).toEqual([]);
  });

  it('leaves the hidden file out of find_references and project_health', async () => {
    const found = await current.run('find_references', { projectId: current.projectId, file: { folderId: current.folderId, path: spritePath().slice(ROOT.length + 1) } }, current.grants('read'));
    const names = rowsOf(found, 'usedBy').map((each) => each.name);
    expect(names).not.toContain(artwork.sheets[0]?.name);
    const health = await current.run('project_health', { projectId: current.projectId }, current.grants('read'));
    expect(JSON.stringify(fieldOf(health, 'findings'))).not.toContain('hidden-sheet');
  });
});
