/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { openFileRig } from './project-file-rig';
import type { FileRig } from './project-file-rig';
import { ROOT } from './project-harness';
import { fieldOf, rowsOf } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let rig: FileRig;

const errorCode = (outcome: Awaited<ReturnType<ToolRig['run']>>): string => (outcome.ok ? 'ok' : outcome.error.code);

beforeEach(async () => {
  rig = await openFileRig();
});

describe('S2 find_references', { tags: ['standard'] }, () => {
  it('lists the files that use a sprite and the file it uses, from the links on disk', async () => {
    const { current } = rig;
    const found = await current.run('find_references', { projectId: current.projectId, file: rig.place(rig.spritePath()) }, current.grants('read'));
    expect(rowsOf(found, 'usedBy').map((each) => each.name).sort()).toEqual(['idle', 'walk']);
    expect(rowsOf(found, 'uses').map((each) => each.kind)).toEqual(['palette']);
    expect(fieldOf(found, 'target')).toMatchObject({ kind: 'sprite' });
  });

  it('answers by asset id too, and says a link is moved when the file went elsewhere', async () => {
    const { current } = rig;
    current.rig.disk.files.set(`${ROOT}/heroes/sprite.bxsprite`, current.rig.disk.files.get(rig.spritePath()) ?? new Uint8Array());
    current.rig.disk.files.delete(rig.spritePath());
    const found = await current.run('find_references', { projectId: current.projectId, assetId: rig.artwork.sprites[0]?.id, direction: 'usedBy' }, current.grants('read'));
    expect(rowsOf(found, 'usedBy').map((each) => each.state)).toEqual(['moved', 'moved']);
    expect(rowsOf(found, 'uses')).toEqual([]);
  });

  it('refuses a file that is not there', async () => {
    const { current } = rig;
    const missing = await current.run('find_references', { projectId: current.projectId, file: { folderId: current.folderId, path: 'sprites/nope.bxsprite' } }, current.grants('read'));
    expect(errorCode(missing)).toBe('FILE_NOT_FOUND');
  });
});

describe('S2 project_health and repair_links', { tags: ['standard'] }, () => {
  it('finds a link with an old path and repairs it with all: true', async () => {
    const { current } = rig;
    const moved = `${ROOT}/heroes/slime-moved.bxsprite`;
    current.rig.disk.files.set(moved, current.rig.disk.files.get(rig.spritePath()) ?? new Uint8Array());
    current.rig.disk.files.delete(rig.spritePath());
    const health = await current.run('project_health', { projectId: current.projectId, checks: ['moved'] }, current.grants('read'));
    const findings = rowsOf(health, 'findings');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.every((each) => each.check === 'moved')).toBe(true);
    const repaired = await current.run('repair_links', { projectId: current.projectId, all: true }, current.grants('edit'));
    expect(fieldOf(repaired, 'fixed')).toBe(findings.length);
    for (const sheet of rig.sheetPaths()) expect(rig.linksOf(sheet)).toContain(moved);
    expect(fieldOf(await current.run('project_health', { projectId: current.projectId }, current.grants('read')), 'total')).toBe(0);
  });

  it('refuses a link the file does not have, and writes nothing', async () => {
    const { current } = rig;
    const sheet = rig.sheetPaths()[0] ?? '';
    const refused = await current.run('repair_links', { projectId: current.projectId, fixes: [{ file: rig.place(sheet), linkId: 'spr_nothere', by: 'remove' }] }, current.grants('edit'));
    expect(fieldOf(refused, 'fixed')).toBe(0);
    expect(rowsOf(refused, 'skipped')).toHaveLength(1);
  });

  it('refuses repair_links to a read project', async () => {
    const { current } = rig;
    const outcome = await current.run('repair_links', { projectId: current.projectId, all: true }, current.grants('read'));
    expect(errorCode(outcome)).toBe('PROJECT_NOT_GRANTED');
  });
});

describe('S2 move_files and rename_file', { tags: ['standard'] }, () => {
  it('moves a sprite, keeps the links of the files that use it and says how many it rewrote', async () => {
    const { current } = rig;
    const outcome = await current.run('move_files', { projectId: current.projectId, files: [rig.place(rig.spritePath())], into: { folderId: current.folderId, path: 'heroes' } }, current.grants('edit'));
    expect(fieldOf(outcome, 'linksRewritten')).toBe(2);
    const target = `${ROOT}/heroes/${rig.spritePath().slice(rig.spritePath().lastIndexOf('/') + 1)}`;
    expect(current.rig.disk.files.has(target)).toBe(true);
    for (const sheet of rig.sheetPaths()) expect(rig.linksOf(sheet)).toContain(target);
  });

  it('renames a sprite, keeps the links and the asset takes the name', async () => {
    const { current } = rig;
    const outcome = await current.run('rename_file', { projectId: current.projectId, file: rig.place(rig.spritePath()), name: 'knight' }, current.grants('edit'));
    expect(fieldOf(outcome, 'to')).toMatchObject({ path: 'sprites/knight.bxsprite' });
    for (const sheet of rig.sheetPaths()) expect(rig.linksOf(sheet)).toContain(`${ROOT}/sprites/knight.bxsprite`);
    expect(fieldOf(outcome, 'linksRewritten')).toBe(2);
  });

  it('refuses a name that is taken, and a read grant', async () => {
    const { current } = rig;
    const taken = await current.run('rename_file', { projectId: current.projectId, file: rig.place(rig.spritePath()), name: rig.artwork.sprites[1]?.name ?? 'x' }, current.grants('edit'));
    expect(errorCode(taken)).toBe('FILE_EXISTS');
    const read = await current.run('move_files', { projectId: current.projectId, files: [rig.place(rig.spritePath())], into: { folderId: current.folderId, path: 'heroes' } }, current.grants('read'));
    expect(errorCode(read)).toBe('PROJECT_NOT_GRANTED');
    expect(current.rig.disk.files.has(rig.spritePath())).toBe(true);
  });
});

describe('S2 create_folder and trash_files', { tags: ['standard'] }, () => {
  it('makes a folder and refuses a name that is taken', async () => {
    const { current } = rig;
    const made = await current.run('create_folder', { projectId: current.projectId, in: { folderId: current.folderId }, name: 'enemies' }, current.grants('edit'));
    expect(fieldOf(made, 'folder')).toMatchObject({ path: 'enemies' });
    expect(current.rig.disk.dirs.has(`${ROOT}/enemies`)).toBe(true);
    const again = await current.run('create_folder', { projectId: current.projectId, in: { folderId: current.folderId }, name: 'enemies' }, current.grants('edit'));
    expect(errorCode(again)).toBe('FILE_EXISTS');
  });

  it('will not trash a file that others link to unless breakLinks is true, and then lists them', async () => {
    const { current } = rig;
    const input = { projectId: current.projectId, files: [rig.place(rig.spritePath())] };
    const refused = await current.run('trash_files', input, current.grants('edit'));
    expect(errorCode(refused)).toBe('FILE_IN_USE');
    expect(current.rig.disk.trashed).toEqual([]);
    const trashed = await current.run('trash_files', { ...input, breakLinks: true }, current.grants('edit'));
    expect(rowsOf(trashed, 'brokenLinksIn')).toHaveLength(2);
    expect(current.rig.disk.trashed).toContain(rig.spritePath());
  });

  it('trashes a file nothing links to without breakLinks', async () => {
    const { current } = rig;
    const sheet = rig.sheetPaths()[0] ?? '';
    const trashed = await current.run('trash_files', { projectId: current.projectId, files: [rig.place(sheet)] }, current.grants('edit'));
    expect(rowsOf(trashed, 'trashed')).toHaveLength(1);
    expect(current.rig.disk.trashed).toContain(sheet);
  });
});

describe('S2 organise and the query of list_assets', { tags: ['standard'] }, () => {
  it('tags sprites, finds them by tag, collects and pins, and the project file holds it', async () => {
    const { current } = rig;
    const ids = rig.artwork.sprites.map((sprite) => sprite.id);
    const tagged = await current.run('organise', { projectId: current.projectId, op: 'tag', assets: ids, tags: ['Hero'] }, current.grants('edit'));
    expect(fieldOf(tagged, 'affected')).toBe(ids.length);
    const listed = await current.run('list_assets', { projectId: current.projectId, kinds: ['sprite', 'sheet'], offset: 0, limit: 50, query: 'tag:hero' }, current.grants('read'));
    expect(rowsOf(listed, 'assets').map((each) => each.id).sort()).toEqual([...ids].sort());
    expect(rowsOf(listed, 'assets')[0]?.tags).toEqual(['hero']);
    const file = rig.place(rig.spritePath());
    await current.run('organise', { projectId: current.projectId, op: 'newCollection', name: 'Players', files: [file] }, current.grants('edit'));
    await current.run('organise', { projectId: current.projectId, op: 'pin', files: [file] }, current.grants('edit'));
    const players = await current.run('list_assets', { projectId: current.projectId, kinds: ['sprite'], offset: 0, limit: 50, query: 'collection:players is:pinned' }, current.grants('read'));
    expect(rowsOf(players, 'assets')).toHaveLength(1);
    expect(rowsOf(players, 'assets')[0]).toMatchObject({ collections: ['Players'], pinned: true });
    expect(Object.keys(useProjectStore.getState().project?.manifest.organise?.tags ?? {}).sort()).toEqual([...ids].sort());
    expect(current.rig.disk.files.get(`${ROOT}/Dungeon.bxproject`)).toBeInstanceOf(Uint8Array);
  });

  it('survives a move: the tag is keyed by asset id', async () => {
    const { current } = rig;
    await current.run('organise', { projectId: current.projectId, op: 'tag', assets: [rig.artwork.sprites[0]?.id ?? ''], tags: ['hero'] }, current.grants('edit'));
    await current.run('move_files', { projectId: current.projectId, files: [rig.place(rig.spritePath())], into: { folderId: current.folderId, path: 'heroes' } }, current.grants('edit'));
    const listed = await current.run('list_assets', { projectId: current.projectId, kinds: ['sprite'], offset: 0, limit: 50, query: 'tag:hero in:heroes' }, current.grants('read'));
    expect(rowsOf(listed, 'assets')).toHaveLength(1);
  });

  it('asks for what the operation needs, and refuses a read grant', async () => {
    const { current } = rig;
    const noTags = await current.run('organise', { projectId: current.projectId, op: 'tag', assets: ['spr_x'] }, current.grants('edit'));
    expect(errorCode(noTags)).toBe('COMMAND_ARGS');
    const noCollection = await current.run('organise', { projectId: current.projectId, op: 'collect', assets: ['spr_x'], collection: 'Nope' }, current.grants('edit'));
    expect(errorCode(noCollection)).toBe('COMMAND_REFUSED');
    const read = await current.run('organise', { projectId: current.projectId, op: 'pin', assets: ['spr_x'] }, current.grants('read'));
    expect(errorCode(read)).toBe('PROJECT_NOT_GRANTED');
  });
});
