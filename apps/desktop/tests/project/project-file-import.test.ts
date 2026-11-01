/* @layer renderer-app @kind test */
import { encodePngRgba } from '@bxel/formats';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openFileRig } from './project-file-rig';
import type { FileRig } from './project-file-rig';
import { ROOT } from './project-harness';
import { rowsOf } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let held: FileRig;

const errorCode = (outcome: Awaited<ReturnType<ToolRig['run']>>): string => (outcome.ok ? 'ok' : outcome.error.code);

beforeEach(async () => {
  held = await openFileRig();
});

const pngOf = (): Uint8Array => {
  const data = new Uint8ClampedArray(4 * 4 * 4);
  for (let at = 0; at < 16; at += 1) data.set(at % 2 === 0 ? [255, 0, 0, 255] : [0, 0, 255, 255], at * 4);
  const encoded = encodePngRgba({ width: 4, height: 4, data });
  if (!encoded.ok) throw new Error('the picture did not encode');
  return encoded.bytes;
};

const GPL = ['GIMP Palette', 'Name: Fire', '#', '255 0 0 Red', '255 128 0 Orange', '255 255 0 Yellow', ''].join(String.fromCharCode(10));

describe('K3 duplicate_file and import_files', { tags: ['standard'] }, () => {
  it('copies a sprite as its own asset, saved beside it, and copies a plain file as it is', async () => {
    const { current } = held;
    const outcome = await current.run('duplicate_file', { projectId: current.projectId, files: [held.place(held.spritePath())] }, current.grants('edit'));
    const [made] = rowsOf(outcome, 'created');
    const copy = `${ROOT}/${String((made?.['to'] as { path: string }).path)}`;
    expect(copy).toContain('copy');
    expect(current.rig.disk.files.has(copy)).toBe(true);
    expect(current.rig.disk.files.has(held.spritePath())).toBe(true);
    current.rig.disk.files.set(`${ROOT}/notes.txt`, Uint8Array.from([1, 2, 3]));
    const plain = await current.run('duplicate_file', { projectId: current.projectId, files: [{ folderId: current.folderId, path: 'notes.txt' }] }, current.grants('edit'));
    expect(rowsOf(plain, 'created')).toHaveLength(1);
    expect(current.rig.disk.files.has(`${ROOT}/notes copy.txt`)).toBe(true);
  });

  it('refuses a folder and a read grant', async () => {
    const { current } = held;
    const folder = await current.run('duplicate_file', { projectId: current.projectId, files: [{ folderId: current.folderId, path: 'heroes' }] }, current.grants('edit'));
    expect(errorCode(folder)).toBe('FILE_NOT_SUPPORTED');
    const read = await current.run('duplicate_file', { projectId: current.projectId, files: [held.place(held.spritePath())] }, current.grants('read'));
    expect(errorCode(read)).toBe('PROJECT_NOT_GRANTED');
  });

  it('imports a PNG as a sprite and a GPL as a palette, saves them, and moves them into the asked folder', async () => {
    const { current } = held;
    const { disk } = current.rig;
    disk.dirs.add(`${ROOT}/art`);
    disk.files.set(`${ROOT}/art/robot.png`, pngOf());
    disk.files.set(`${ROOT}/art/fire.gpl`, new TextEncoder().encode(GPL));
    disk.files.set(`${ROOT}/art/notes.txt`, Uint8Array.from([1]));
    const sources = ['art/robot.png', 'art/fire.gpl', 'art/notes.txt'].map((path) => ({ folderId: current.folderId, path }));
    const outcome = await current.run('import_files', { projectId: current.projectId, sources, into: { folderId: current.folderId, path: 'heroes' } }, current.grants('edit'));
    const imported = rowsOf(outcome, 'imported');
    expect(imported).toHaveLength(2);
    for (const each of imported) for (const created of each['created'] as { path: string }[]) expect(created.path.startsWith('heroes/')).toBe(true);
    expect([...disk.files.keys()].some((path) => path.startsWith(`${ROOT}/heroes/`) && path.endsWith('.bxsprite'))).toBe(true);
    expect([...disk.files.keys()].some((path) => path.startsWith(`${ROOT}/heroes/`) && path.endsWith('.bxpalette'))).toBe(true);
    expect(rowsOf(outcome, 'skipped').map((each) => each['path'])).toEqual(['art/notes.txt']);
  });

  it('refuses to import for a read grant', async () => {
    const { current } = held;
    const read = await current.run('import_files', { projectId: current.projectId, sources: [held.place(held.spritePath())] }, current.grants('read'));
    expect(errorCode(read)).toBe('PROJECT_NOT_GRANTED');
  });
});
