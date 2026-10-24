/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ROOT } from './project-harness';
import { bxelBytes, fieldOf, grantOf, rowsOf, toolRig } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let held: ToolRig;

const granted = (access: 'read' | 'edit' = 'edit') => [grantOf(held.projectId, access)];

const location = (path: string, extra: object = {}) => ({ projectId: held.projectId, folderId: held.folderId, path, ...extra });

const listInput = (extra: object = {}) => ({
  projectId: held.projectId,
  folderId: held.folderId,
  kinds: ['bxel', 'image', 'palette', 'sheet_json'],
  offset: 0,
  limit: 200,
  ...extra,
});

const putFile = (name: string, content: string | Uint8Array = 'x'): void => {
  held.rig.disk.files.set(`${ROOT}/${name}`, content);
};

beforeEach(async () => {
  held = await toolRig();
});

describe('list_places', () => {
  it('leaves an ungranted project out', async () => {
    const places = await held.run('list_places', {}, []);
    expect(places).toMatchObject({ ok: true, projects: [] });
  });

  it('lists a granted project with its folders', async () => {
    const places = await held.run('list_places', {}, granted('read'));
    expect(places).toMatchObject({
      ok: true,
      projects: [{ projectId: held.projectId, name: 'Dungeon', access: 'read', open: true, folders: [{ folderId: held.folderId, name: 'Dungeon' }], newFiles: null, exports: null }],
    });
  });

  it('shows the lower of the session mode and the grant', async () => {
    const places = await held.run('list_places', {}, granted('edit'), 'read');
    expect(places).toMatchObject({ projects: [{ access: 'read' }] });
  });

  it('ignores a grant stored for another folder, and a project file that says edit', async () => {
    const elsewhere = [grantOf(held.projectId, 'edit', 'D:/Copy/Dungeon')];
    expect(await held.run('list_places', {}, elsewhere)).toMatchObject({ projects: [] });
  });
});

describe('list_files', () => {
  it('answers PROJECT_NOT_FOUND for an ungranted project, as for one that does not exist', async () => {
    const ungranted = await held.run('list_files', listInput(), []);
    const unknown = await held.run('list_files', listInput({ projectId: 'prj_zzzzzzzzzzzz' }), granted());
    expect(ungranted).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_FOUND' } });
    expect(unknown).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_FOUND' } });
  });

  it('lists folders first, then files by name, with sizes and open documents', async () => {
    putFile('zed.bxel', bxelBytes('zed'));
    putFile('Alpha.bxel', bxelBytes('Alpha'));
    putFile('notes.txt');
    putFile('art.png', new Uint8Array(4));
    held.rig.disk.dirs.add(`${ROOT}/old`);
    await held.run('open_file', { file: location('Alpha.bxel'), activate: false }, granted());
    const listed = await held.run('list_files', listInput(), granted('read'));
    expect(listed).toMatchObject({ ok: true, path: '', total: 4, truncated: false });
    const entries = rowsOf(listed, 'entries');
    expect(entries.map((entry) => `${entry.kind}:${entry.name}`)).toEqual(['folder:old', 'bxel:Alpha.bxel', 'image:art.png', 'bxel:zed.bxel']);
    expect(entries[1]?.documentId).toMatch(/^doc_/);
    expect(entries[3]?.documentId).toBeNull();
  });

  it('counts names the path rules refuse in skipped', async () => {
    putFile('hero.bxel', bxelBytes('hero'));
    putFile('CON.png');
    const listed = await held.run('list_files', listInput(), granted());
    expect(listed).toMatchObject({ ok: true, skipped: 2, total: 1 });
  });

  it('pages a large folder in two calls', async () => {
    for (let at = 0; at < 600; at += 1) putFile(`f${String(at).padStart(3, '0')}.bxel`, 'x');
    const first = await held.run('list_files', listInput({ limit: 500 }), granted());
    expect(first).toMatchObject({ ok: true, total: 600, truncated: true });
    expect(rowsOf(first, 'entries')).toHaveLength(500);
    const second = await held.run('list_files', listInput({ limit: 500, offset: 500 }), granted());
    expect(second).toMatchObject({ ok: true, total: 600, truncated: false });
    expect(rowsOf(second, 'entries')).toHaveLength(100);
  });

  it('lists a subfolder by its relative path', async () => {
    held.rig.disk.dirs.add(`${ROOT}/sprites`);
    held.rig.disk.files.set(`${ROOT}/sprites/slime.bxel`, bxelBytes('slime'));
    const listed = await held.run('list_files', listInput({ path: 'sprites' }), granted());
    expect(listed).toMatchObject({ ok: true, path: 'sprites', entries: [{ name: 'slime.bxel', kind: 'bxel' }] });
  });

  it('refuses a path that leaves the folder or breaks the path rules', async () => {
    const up = await held.run('list_files', listInput({ path: '../Other' }), granted());
    expect(up).toMatchObject({ ok: false });
    const device = await held.run('list_files', listInput({ path: 'CON' }), granted());
    expect(device).toMatchObject({ ok: false });
  });

  it('answers FOLDER_NOT_FOUND for an unknown folder id and for a folder that is not there', async () => {
    const unknown = await held.run('list_files', listInput({ folderId: 'fld_zzzzzzzz' }), granted());
    expect(unknown).toMatchObject({ ok: false, error: { code: 'FOLDER_NOT_FOUND' } });
    const missing = await held.run('list_files', listInput({ path: 'nowhere' }), granted());
    expect(missing).toMatchObject({ ok: false, error: { code: 'FOLDER_NOT_FOUND' } });
  });
});

describe('open_file in a project', () => {
  it('opens a .bxel file as a new document and returns the same one the second time', async () => {
    putFile('hero.bxel', bxelBytes('hero'));
    const first = await held.run('open_file', { file: location('hero.bxel'), activate: false }, granted('read'));
    expect(first).toMatchObject({ ok: true, alreadyOpen: false, fileName: 'hero.bxel', readOnly: false, outcome: 'ok' });
    const second = await held.run('open_file', { file: location('hero.bxel'), activate: false }, granted('read'));
    expect(second).toMatchObject({ ok: true, alreadyOpen: true, documentId: fieldOf(first, 'documentId') });
    expect(held.rig.kit.host.list()).toHaveLength(1);
  });

  it('answers PROJECT_NOT_FOUND for an ungranted project and opens nothing', async () => {
    putFile('hero.bxel', bxelBytes('hero'));
    const refused = await held.run('open_file', { file: location('hero.bxel'), activate: false }, []);
    expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_FOUND' } });
    expect(held.rig.kit.host.list()).toHaveLength(0);
  });

  it('answers FILE_NOT_FOUND for a file that is not there and FILE_NOT_SUPPORTED for a picture', async () => {
    putFile('art.png', new Uint8Array(4));
    const missing = await held.run('open_file', { file: location('gone.bxel'), activate: false }, granted());
    expect(missing).toMatchObject({ ok: false, error: { code: 'FILE_NOT_FOUND' } });
    const picture = await held.run('open_file', { file: location('art.png'), activate: false }, granted());
    expect(picture).toMatchObject({ ok: false, error: { code: 'FILE_NOT_SUPPORTED' } });
  });

  it('refuses a path that climbs out of the folder', async () => {
    const climbed = await held.run('open_file', { file: location('sub/../../x.bxel'), activate: false }, granted());
    expect(climbed).toMatchObject({ ok: false });
    expect(held.rig.kit.host.list()).toHaveLength(0);
  });

  it('shows an open project file with its project place, or as ungranted when there is no grant', async () => {
    putFile('hero.bxel', bxelBytes('hero'));
    await held.run('open_file', { file: location('hero.bxel'), activate: false }, granted());
    const listed = await held.run('list_documents', {}, granted());
    expect(listed).toMatchObject({ documents: [{ fileName: 'hero.bxel', place: location('hero.bxel') }] });
    const hiddenListing = await held.run('list_documents', {}, []);
    expect(hiddenListing).toMatchObject({ documents: [{ fileName: 'hero.bxel', place: { project: { name: 'Dungeon', granted: false } } }] });
  });

  it('refuses a damaged file with its own code and opens nothing', async () => {
    putFile('bad.bxel', new Uint8Array([1, 2, 3]));
    const damaged = await held.run('open_file', { file: location('bad.bxel'), activate: false }, granted());
    expect(damaged).toMatchObject({ ok: false });
    expect(held.rig.kit.host.list()).toHaveLength(0);
  });
});
