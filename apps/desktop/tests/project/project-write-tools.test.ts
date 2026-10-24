/* @layer renderer-app @kind test */
import { decodeArtwork } from '@bxel/document/native';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { bxelBytes, fieldOf, grantOf, ROOT, rowsOf, toolRig } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let current: ToolRig;

const grantsAs = (access: 'read' | 'edit' = 'edit') => [grantOf(current.projectId, access)];

const location = (path: string) => ({ projectId: current.projectId, folderId: current.folderId, path });

const documentOf = async (): Promise<string> => {
  current.rig.disk.files.set(`${ROOT}/hero.bxel`, bxelBytes('hero'));
  const opened = await current.run('open_file', { file: location('hero.bxel'), activate: false }, grantsAs());
  return String(fieldOf(opened, 'documentId'));
};

const saveInput = (documentId: string, path: string, overwrite = false) => ({ documentId, target: { location: location(path), overwrite } });

const exportInput = async (documentId: string, path: string, overwrite = false) => {
  const doc = await current.run('get_document', { documentId, spriteOffset: 0, spriteLimit: 10 }, grantsAs());
  const spriteId = String(rowsOf(doc, 'sprites')[0]?.spriteId);
  return { documentId, format: 'png', source: { spriteId }, scale: 1, overwrite, location: location(path) };
};

const code = (outcome: { ok: boolean; error?: { code: string } }): string | undefined => outcome.error?.code;

beforeEach(async () => {
  current = await toolRig();
});

describe('save_document into a project', () => {
  it('writes the file when the project is granted Read and edit, and remembers the new place', async () => {
    const id = await documentOf();
    const saved = await current.run('save_document', saveInput(id, 'copy.bxel'), grantsAs('edit'));
    expect(saved).toMatchObject({ ok: true, fileName: 'copy.bxel', place: location('copy.bxel') });
    const bytes = current.rig.disk.files.get(`${ROOT}/copy.bxel`);
    expect(decodeArtwork(bytes as Uint8Array).outcome).toBe('ok');
    expect(current.rig.kit.paths.pathOf(id as never)).toBe(`${ROOT}/copy.bxel`);
  });

  it('makes the missing folders of the path inside the project first', async () => {
    const id = await documentOf();
    const saved = await current.run('save_document', saveInput(id, 'sprites/deep/copy.bxel'), grantsAs('edit'));
    expect(saved).toMatchObject({ ok: true });
    expect(current.rig.disk.made).toEqual([`${ROOT}/sprites/deep`]);
    expect(current.rig.disk.files.has(`${ROOT}/sprites/deep/copy.bxel`)).toBe(true);
  });

  it('is refused with PROJECT_NOT_GRANTED when the project is granted read only', async () => {
    const id = await documentOf();
    const refused = await current.run('save_document', saveInput(id, 'copy.bxel'), grantsAs('read'));
    expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    expect(current.rig.disk.writes).toEqual([]);
  });

  it('is refused with PROJECT_NOT_GRANTED for a read only session even on an edit grant', async () => {
    const id = await documentOf();
    const refused = await current.run('save_document', saveInput(id, 'copy.bxel'), grantsAs('edit'), 'read');
    expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    expect(current.rig.disk.files.has(`${ROOT}/copy.bxel`)).toBe(false);
  });

  it('answers PROJECT_NOT_FOUND for a project without a grant, as for one that does not exist', async () => {
    const id = await documentOf();
    const ungranted = await current.run('save_document', saveInput(id, 'copy.bxel'), []);
    expect(code(ungranted)).toBe('PROJECT_NOT_FOUND');
    expect(current.rig.disk.writes).toEqual([]);
  });

  it('follows the assistant can write setting', async () => {
    const id = await documentOf();
    const refused = await current.runWith('save_document', saveInput(id, 'copy.bxel'), { grants: grantsAs('edit'), settings: { assistantWrite: 'nowhere' } });
    expect(code(refused)).toBe('WRITE_NOT_ALLOWED');
    const allowed = await current.runWith('save_document', saveInput(id, 'copy.bxel'), { grants: grantsAs('edit'), settings: { assistantWrite: 'projects_and_assistant_folder' } });
    expect(allowed).toMatchObject({ ok: true });
  });

});

describe('save_document paths and places', () => {
  it('keeps an existing file unless overwrite is true', async () => {
    const id = await documentOf();
    const refused = await current.run('save_document', saveInput(id, 'hero.bxel'), grantsAs('edit'));
    expect(code(refused)).toBe('FILE_EXISTS');
    const replaced = await current.run('save_document', saveInput(id, 'hero.bxel', true), grantsAs('edit'));
    expect(replaced).toMatchObject({ ok: true, fileName: 'hero.bxel' });
  });

  it.each(['../escape.bxel', 'sub/../../escape.bxel', 'copy.png', 'CON.bxel'])('refuses the path %s and writes nothing', async (path) => {
    const id = await documentOf();
    const refused = await current.run('save_document', saveInput(id, path), grantsAs('edit'));
    expect(refused.ok).toBe(false);
    expect(current.rig.disk.writes).toEqual([]);
  });

  it('reports a write that Brock refuses as PATH_NOT_ALLOWED with the reason', async () => {
    const id = await documentOf();
    vi.spyOn(current.rig.disk.port, 'write').mockRejectedValueOnce(new Error('The folder is protected'));
    const refused = await current.run('save_document', saveInput(id, 'copy.bxel'), grantsAs('edit'));
    expect(code(refused)).toBe('PATH_NOT_ALLOWED');
    expect(JSON.stringify(refused)).toContain('The folder is protected');
  });

  it('writes into a project that was restored at launch and is not open', async () => {
    const id = await documentOf();
    const project = useProjectStore.getState().project;
    if (!project) throw new Error('no project');
    useProjectStore.setState({ project: null, held: [project] });
    const places = await current.run('list_places', {}, grantsAs('edit'));
    expect(rowsOf(places, 'projects')).toMatchObject([{ name: 'Dungeon', open: false, access: 'edit' }]);
    const saved = await current.run('save_document', saveInput(id, 'copy.bxel'), grantsAs('edit'));
    expect(saved).toMatchObject({ ok: true, place: location('copy.bxel') });
  });
});

describe('export_document into a project', () => {
  it('writes the picture when the project is granted Read and edit', async () => {
    const id = await documentOf();
    const done = await current.run('export_document', await exportInput(id, 'exports/hero.png'), grantsAs('edit'));
    expect(done).toMatchObject({ ok: true, files: [{ fileName: 'hero.png' }] });
    expect(current.rig.disk.files.get(`${ROOT}/exports/hero.png`)).toBeInstanceOf(Uint8Array);
    expect(current.rig.disk.made).toEqual([`${ROOT}/exports`]);
  });

  it('is refused with PROJECT_NOT_GRANTED when the project is granted read only', async () => {
    const id = await documentOf();
    const refused = await current.run('export_document', await exportInput(id, 'hero.png'), grantsAs('read'));
    expect(code(refused)).toBe('PROJECT_NOT_GRANTED');
    expect(current.rig.disk.files.has(`${ROOT}/hero.png`)).toBe(false);
  });

  it('keeps an existing picture unless overwrite is true', async () => {
    const id = await documentOf();
    current.rig.disk.files.set(`${ROOT}/hero.png`, new Uint8Array(3));
    expect(code(await current.run('export_document', await exportInput(id, 'hero.png'), grantsAs('edit')))).toBe('FILE_EXISTS');
    const replaced = await current.run('export_document', await exportInput(id, 'hero.png', true), grantsAs('edit'));
    expect(replaced).toMatchObject({ ok: true });
  });

  it('refuses a path that is not a .png and a path that leaves the folder', async () => {
    const id = await documentOf();
    expect((await current.run('export_document', await exportInput(id, 'hero.bxel'), grantsAs('edit'))).ok).toBe(false);
    expect((await current.run('export_document', await exportInput(id, '../hero.png'), grantsAs('edit'))).ok).toBe(false);
    expect(current.rig.disk.writes).toEqual([]);
  });

  it('does not keep the picture on the recent list', async () => {
    const id = await documentOf();
    const spy = vi.spyOn(current.rig.disk.port, 'write');
    await current.run('export_document', await exportInput(id, 'hero.png'), grantsAs('edit'));
    expect(spy).toHaveBeenCalledWith(`${ROOT}/hero.png`, expect.any(Uint8Array), { recent: false });
  });
});
