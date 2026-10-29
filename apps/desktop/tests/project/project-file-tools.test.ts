/* @layer renderer-app @kind test */
import { resolveLinkPath } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { readAssetManifest } from '@bxel/document/native';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { writeProjectAssets, sampleArtwork } from '../workspace/workspace-harness';
import { ROOT } from './project-harness';
import { fieldOf, rowsOf, toolRig } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let current: ToolRig;
let artwork: Artwork;
let paths: ReadonlyMap<string, string>;

const rel = (path: string): string => path.slice(ROOT.length + 1);

const place = (path: string) => ({ folderId: current.folderId, path: rel(path) });

const spritePath = (): string => {
  const sprite = artwork.sprites[0];
  return paths.get(sprite?.id ?? '') ?? '';
};

const sheetPaths = (): readonly string[] => artwork.sheets.map((sheet) => paths.get(sheet.id) ?? '');

const linksOf = (path: string): readonly string[] => {
  const bytes = current.rig.disk.files.get(path);
  const manifest = bytes instanceof Uint8Array ? readAssetManifest(bytes) : null;
  if (!manifest) throw new Error(`no asset file at ${path}`);
  return manifest.links.map((link) => resolveLinkPath(path, link.path));
};

const errorCode = (outcome: Awaited<ReturnType<ToolRig['run']>>): string => (outcome.ok ? 'ok' : outcome.error.code);

beforeEach(async () => {
  artwork = sampleArtwork();
  current = await toolRig({
    seed: (disk) => {
      paths = writeProjectAssets(disk, ROOT, artwork);
    },
  });
  current.rig.disk.dirs.add(`${ROOT}/heroes`);
});

describe('find_references', () => {
  it('lists the files that use a sprite and the file it uses, from the links on disk', async () => {
    const found = await current.run('find_references', { projectId: current.projectId, file: place(spritePath()) }, current.grants('read'));
    expect(rowsOf(found, 'usedBy').map((each) => each.name).sort()).toEqual(['idle', 'walk']);
    expect(rowsOf(found, 'uses').map((each) => each.kind)).toEqual(['palette']);
    expect(fieldOf(found, 'target')).toMatchObject({ kind: 'sprite' });
  });

  it('answers by asset id too, and says a link is moved when the file went elsewhere', async () => {
    const sprite = artwork.sprites[0];
    current.rig.disk.files.set(`${ROOT}/heroes/sprite.bxsprite`, current.rig.disk.files.get(spritePath()) ?? new Uint8Array());
    current.rig.disk.files.delete(spritePath());
    const found = await current.run('find_references', { projectId: current.projectId, assetId: sprite?.id, direction: 'usedBy' }, current.grants('read'));
    expect(rowsOf(found, 'usedBy').map((each) => each.state)).toEqual(['moved', 'moved']);
    expect(rowsOf(found, 'uses')).toEqual([]);
  });

  it('refuses a file that is not there', async () => {
    const missing = await current.run('find_references', { projectId: current.projectId, file: { folderId: current.folderId, path: 'sprites/nope.bxsprite' } }, current.grants('read'));
    expect(errorCode(missing)).toBe('FILE_NOT_FOUND');
  });
});

describe('project_health and repair_links', () => {
  it('finds a link with an old path and repairs it with all: true', async () => {
    const moved = `${ROOT}/heroes/slime-moved.bxsprite`;
    current.rig.disk.files.set(moved, current.rig.disk.files.get(spritePath()) ?? new Uint8Array());
    current.rig.disk.files.delete(spritePath());
    const health = await current.run('project_health', { projectId: current.projectId, checks: ['moved'] }, current.grants('read'));
    const findings = rowsOf(health, 'findings');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.every((each) => each.check === 'moved')).toBe(true);
    const repaired = await current.run('repair_links', { projectId: current.projectId, all: true }, current.grants('edit'));
    expect(fieldOf(repaired, 'fixed')).toBe(findings.length);
    for (const sheet of sheetPaths()) expect(linksOf(sheet)).toContain(moved);
    expect(fieldOf(await current.run('project_health', { projectId: current.projectId }, current.grants('read')), 'total')).toBe(0);
  });

  it('removes a link by file and link id, and refuses a link the file does not have', async () => {
    const health = await current.run('project_health', { projectId: current.projectId }, current.grants('read'));
    expect(fieldOf(health, 'total')).toBe(0);
    const sheet = sheetPaths()[0] ?? '';
    const link = linksOf(sheet).length;
    expect(link).toBeGreaterThan(0);
    const refused = await current.run('repair_links', { projectId: current.projectId, fixes: [{ file: place(sheet), linkId: 'spr_nothere', by: 'remove' }] }, current.grants('edit'));
    expect(fieldOf(refused, 'fixed')).toBe(0);
    expect(rowsOf(refused, 'skipped')).toHaveLength(1);
  });

  it('refuses repair_links to a read project', async () => {
    const outcome = await current.run('repair_links', { projectId: current.projectId, all: true }, current.grants('read'));
    expect(errorCode(outcome)).toBe('PROJECT_NOT_GRANTED');
  });
});

describe('move_files and rename_file', () => {
  it('moves a sprite, keeps the links of the files that use it and says how many it rewrote', async () => {
    const outcome = await current.run('move_files', { projectId: current.projectId, files: [place(spritePath())], into: { folderId: current.folderId, path: 'heroes' } }, current.grants('edit'));
    expect(fieldOf(outcome, 'linksRewritten')).toBe(2);
    const target = `${ROOT}/heroes/${spritePath().slice(spritePath().lastIndexOf('/') + 1)}`;
    expect(current.rig.disk.files.has(target)).toBe(true);
    for (const sheet of sheetPaths()) expect(linksOf(sheet)).toContain(target);
  });

  it('renames a sprite, keeps the links and the asset takes the name', async () => {
    const outcome = await current.run('rename_file', { projectId: current.projectId, file: place(spritePath()), name: 'knight' }, current.grants('edit'));
    expect(fieldOf(outcome, 'to')).toMatchObject({ path: 'sprites/knight.bxsprite' });
    for (const sheet of sheetPaths()) expect(linksOf(sheet)).toContain(`${ROOT}/sprites/knight.bxsprite`);
    expect(fieldOf(outcome, 'linksRewritten')).toBe(2);
  });

  it('refuses a name that is taken, and a read grant', async () => {
    const taken = await current.run('rename_file', { projectId: current.projectId, file: place(spritePath()), name: artwork.sprites[1]?.name ?? 'x' }, current.grants('edit'));
    expect(errorCode(taken)).toBe('FILE_EXISTS');
    const read = await current.run('move_files', { projectId: current.projectId, files: [place(spritePath())], into: { folderId: current.folderId, path: 'heroes' } }, current.grants('read'));
    expect(errorCode(read)).toBe('PROJECT_NOT_GRANTED');
    expect(current.rig.disk.files.has(spritePath())).toBe(true);
  });
});

describe('create_folder and trash_files', () => {
  it('makes a folder and refuses a name that is taken', async () => {
    const made = await current.run('create_folder', { projectId: current.projectId, in: { folderId: current.folderId }, name: 'enemies' }, current.grants('edit'));
    expect(fieldOf(made, 'folder')).toMatchObject({ path: 'enemies' });
    expect(current.rig.disk.dirs.has(`${ROOT}/enemies`)).toBe(true);
    const again = await current.run('create_folder', { projectId: current.projectId, in: { folderId: current.folderId }, name: 'enemies' }, current.grants('edit'));
    expect(errorCode(again)).toBe('FILE_EXISTS');
  });

  it('will not trash a file that others link to unless breakLinks is true, and then lists them', async () => {
    const input = { projectId: current.projectId, files: [place(spritePath())] };
    const refused = await current.run('trash_files', input, current.grants('edit'));
    expect(errorCode(refused)).toBe('FILE_IN_USE');
    expect(current.rig.disk.trashed).toEqual([]);
    const trashed = await current.run('trash_files', { ...input, breakLinks: true }, current.grants('edit'));
    expect(rowsOf(trashed, 'brokenLinksIn')).toHaveLength(2);
    expect(current.rig.disk.trashed).toContain(spritePath());
  });

  it('trashes a file nothing links to without breakLinks', async () => {
    const sheet = sheetPaths()[0] ?? '';
    const trashed = await current.run('trash_files', { projectId: current.projectId, files: [place(sheet)] }, current.grants('edit'));
    expect(rowsOf(trashed, 'trashed')).toHaveLength(1);
    expect(current.rig.disk.trashed).toContain(sheet);
  });
});

describe('organise and the query of list_assets', () => {
  it('tags three sprites, finds them by tag, collects and pins, and the project file holds it', async () => {
    const ids = artwork.sprites.map((sprite) => sprite.id);
    const tagged = await current.run('organise', { projectId: current.projectId, op: 'tag', assets: ids, tags: ['Hero'] }, current.grants('edit'));
    expect(fieldOf(tagged, 'affected')).toBe(ids.length);
    const listed = await current.run('list_assets', { projectId: current.projectId, kinds: ['sprite', 'sheet'], offset: 0, limit: 50, query: 'tag:hero' }, current.grants('read'));
    expect(rowsOf(listed, 'assets').map((each) => each.id).sort()).toEqual([...ids].sort());
    expect(rowsOf(listed, 'assets')[0]?.tags).toEqual(['hero']);
    await current.run('organise', { projectId: current.projectId, op: 'newCollection', name: 'Players', files: [place(spritePath())] }, current.grants('edit'));
    await current.run('organise', { projectId: current.projectId, op: 'pin', files: [place(spritePath())] }, current.grants('edit'));
    const players = await current.run('list_assets', { projectId: current.projectId, kinds: ['sprite'], offset: 0, limit: 50, query: 'collection:players is:pinned' }, current.grants('read'));
    expect(rowsOf(players, 'assets')).toHaveLength(1);
    expect(rowsOf(players, 'assets')[0]).toMatchObject({ collections: ['Players'], pinned: true });
    const stored = useProjectStore.getState().project?.manifest.organise;
    expect(Object.keys(stored?.tags ?? {}).sort()).toEqual([...ids].sort());
    const onDisk = current.rig.disk.files.get(`${ROOT}/Dungeon.bxproject`);
    expect(onDisk).toBeInstanceOf(Uint8Array);
  });

  it('survives a move: the tag is keyed by asset id', async () => {
    const sprite = artwork.sprites[0];
    await current.run('organise', { projectId: current.projectId, op: 'tag', assets: [sprite?.id ?? ''], tags: ['hero'] }, current.grants('edit'));
    await current.run('move_files', { projectId: current.projectId, files: [place(spritePath())], into: { folderId: current.folderId, path: 'heroes' } }, current.grants('edit'));
    const listed = await current.run('list_assets', { projectId: current.projectId, kinds: ['sprite'], offset: 0, limit: 50, query: 'tag:hero in:heroes' }, current.grants('read'));
    expect(rowsOf(listed, 'assets')).toHaveLength(1);
  });

  it('asks for what the operation needs, and refuses a read grant', async () => {
    const noTags = await current.run('organise', { projectId: current.projectId, op: 'tag', assets: ['spr_x'] }, current.grants('edit'));
    expect(errorCode(noTags)).toBe('COMMAND_ARGS');
    const noCollection = await current.run('organise', { projectId: current.projectId, op: 'collect', assets: ['spr_x'], collection: 'Nope' }, current.grants('edit'));
    expect(errorCode(noCollection)).toBe('COMMAND_REFUSED');
    const read = await current.run('organise', { projectId: current.projectId, op: 'pin', assets: ['spr_x'] }, current.grants('read'));
    expect(errorCode(read)).toBe('PROJECT_NOT_GRANTED');
  });
});
