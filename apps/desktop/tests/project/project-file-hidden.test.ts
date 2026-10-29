/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openHiddenFileRig } from './project-file-rig';
import type { FileRig } from './project-file-rig';
import { fieldOf, rowsOf } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let rig: FileRig;

beforeEach(async () => {
  rig = await openHiddenFileRig();
});

describe('the project file tools and a folder the assistant cannot see', () => {
  it('refuses to move a file that a hidden file links to, and changes nothing', async () => {
    const { current } = rig;
    const input = { projectId: current.projectId, files: [rig.place(rig.spritePath())], into: { folderId: current.folderId, path: 'heroes' } };
    const outcome = await current.run('move_files', input, current.grants('edit'));
    expect(outcome.ok ? 'ok' : outcome.error.code).toBe('PATH_NOT_ALLOWED');
    expect(current.rig.disk.files.has(rig.spritePath())).toBe(true);
    expect(current.rig.disk.renamed).toEqual([]);
  });

  it('refuses to trash such a file even with breakLinks', async () => {
    const { current } = rig;
    const outcome = await current.run('trash_files', { projectId: current.projectId, files: [rig.place(rig.spritePath())], breakLinks: true }, current.grants('edit'));
    expect(outcome.ok ? 'ok' : outcome.error.code).toBe('PATH_NOT_ALLOWED');
    expect(current.rig.disk.trashed).toEqual([]);
  });

  it('leaves the hidden file out of find_references and project_health', async () => {
    const { current } = rig;
    const found = await current.run('find_references', { projectId: current.projectId, file: rig.place(rig.spritePath()) }, current.grants('read'));
    expect(rowsOf(found, 'usedBy').map((each) => each.name)).not.toContain(rig.artwork.sheets[0]?.name);
    const health = await current.run('project_health', { projectId: current.projectId }, current.grants('read'));
    expect(JSON.stringify(fieldOf(health, 'findings'))).not.toContain('hidden-sheet');
  });
});
