/* @layer renderer-app @kind test */
import type { Artwork } from '@bxel/document';
import { splitIntoAssets } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { legacyBytes, paintSprite, sampleArtwork, writeProjectAssets } from '../workspace/workspace-harness';
import { manifestOf, ROOT } from './project-harness';
import { fieldOf, grantOf, rowsOf, toolRig } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let current: ToolRig;
let artwork: Artwork;
let paths: ReadonlyMap<string, string>;



const listing = (extra: object = {}) => ({ projectId: current.projectId, kinds: ['sprite', 'sheet', 'palette', 'tileset', 'tilemap'], offset: 0, limit: 200, ...extra });

const documentOf = (): string => {
  const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
  if (!workspace) throw new Error('the project workspace did not open');
  return workspace.documentId;
};

const spriteOf = (name: string) => {
  const found = artwork.sprites.find((sprite) => sprite.name === name);
  if (!found) throw new Error(`no sprite ${name}`);
  return found;
};

beforeEach(async () => {
  artwork = sampleArtwork();
  current = await toolRig({
    seed: (disk) => {
      paths = writeProjectAssets(disk, ROOT, artwork);
    },
  });
});

describe('list_assets', () => {
  it('lists every asset of a granted project with its place, and the sheets that use a sprite', async () => {
    const listed = await current.run('list_assets', listing(), current.grants('read'));
    const assets = rowsOf(listed, 'assets');
    expect(assets.filter((asset) => asset.kind === 'sprite')).toHaveLength(2);
    expect(assets.filter((asset) => asset.kind === 'sheet').map((asset) => asset.name)).toEqual(['idle', 'walk']);
    expect(assets.every((asset) => asset.opened === true && asset.dirty === false)).toBe(true);
    const sprite = assets.find((asset) => asset.kind === 'sprite');
    expect(sprite?.usedBy).toHaveLength(2);
    expect(sprite?.documentId).toBe(documentOf());
    expect(sprite?.location).toMatchObject({ projectId: current.projectId, folderId: current.folderId });
    expect(fieldOf(listed, 'total')).toBe(assets.length);
  });

  it('narrows by kind, folder, name and used by', async () => {
    const sheets = await current.run('list_assets', listing({ kinds: ['sheet'] }), current.grants('read'));
    expect(rowsOf(sheets, 'assets').map((asset) => asset.kind)).toEqual(['sheet', 'sheet']);
    const inSheets = await current.run('list_assets', listing({ folderId: current.folderId, path: 'sheets' }), current.grants('read'));
    expect(rowsOf(inSheets, 'assets').map((asset) => asset.kind)).toEqual(['sheet', 'sheet']);
    const found = await current.run('list_assets', listing({ search: 'WAL' }), current.grants('read'));
    expect(rowsOf(found, 'assets').map((asset) => asset.name)).toEqual(['walk']);
    const used = await current.run('list_assets', listing({ usedBy: artwork.sprites[0]?.id }), current.grants('read'));
    expect(rowsOf(used, 'assets').map((asset) => asset.name)).toEqual(['idle', 'walk']);
  });

  it('marks a painted sprite dirty and pages the list', async () => {
    paintSprite(documentOf() as never, artwork.sprites[0]?.id as never);
    const dirty = rowsOf(await current.run('list_assets', listing(), current.grants('read')), 'assets').filter((asset) => asset.dirty === true);
    expect(dirty.map((asset) => asset.kind)).toEqual(['sprite']);
    const page = await current.run('list_assets', listing({ limit: 2, offset: 1 }), current.grants('read'));
    expect(rowsOf(page, 'assets')).toHaveLength(2);
    expect(page).toMatchObject({ truncated: true });
  });

  it('answers PROJECT_NOT_FOUND for a project without a grant', async () => {
    const refused = await current.run('list_assets', listing(), []);
    expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_FOUND' } });
  });
});

describe('assistant.folders', () => {
  it('hides the folders the owner did not show, in list_places, list_assets and list_files', async () => {
    const owner = manifestOf();
    const hidden = await toolRig({ manifest: { ...owner, assistant: { access: 'off', folders: [] } }, seed: (disk) => void writeProjectAssets(disk, ROOT, artwork) });
    const grants = [grantOf(hidden.projectId, 'edit')];
    const places = await hidden.run('list_places', {}, grants);
    expect(rowsOf(places, 'projects')[0]?.folders).toEqual([]);
    const assets = await hidden.run('list_assets', { projectId: hidden.projectId, kinds: ['sprite'], offset: 0, limit: 10 }, grants);
    expect(rowsOf(assets, 'assets')).toEqual([]);
    const asked = await hidden.run('list_assets', { projectId: hidden.projectId, kinds: ['sprite'], folderId: hidden.folderId, offset: 0, limit: 10 }, grants);
    expect(asked).toMatchObject({ ok: false, error: { code: 'FOLDER_NOT_FOUND' } });
    const files = await hidden.run('list_files', { projectId: hidden.projectId, folderId: hidden.folderId, kinds: ['bxel'], offset: 0, limit: 10 }, grants);
    expect(files).toMatchObject({ ok: false, error: { code: 'FOLDER_NOT_FOUND' } });
  });
});

describe('open_file for every kind', () => {
  it.each([
    ['sprites/slime.bxsprite', 'sprite'],
    ['sheets/walk.bxsheet', 'sheet'],
  ])('opens %s as a %s of the project workspace', async (path, kind) => {
    const listed = rowsOf(await current.run('list_assets', listing({ kinds: [kind] }), current.grants('read')), 'assets');
    const name = path.split('/')[1]?.split('.')[0];
    const target = listed.find((asset) => asset.name === name);
    const opened = await current.run('open_file', { file: current.locate(String((target?.location as { path: string }).path)), activate: false }, current.grants('read'));
    expect(opened).toMatchObject({ ok: true, documentId: documentOf(), asset: { kind }, legacy: false });
  });
});

describe('create_document with a kind', () => {
  const bank = { name: 'Main', cap: 16, transparent: true, colors: [{ rgb: '#ff0000' }] };
  const create = (kind: string, extra: object = {}) => current.run('create_document', { name: `made ${kind}`, kind, bank, ...extra }, current.grants());

  it.each(['sprite', 'sheet', 'palette', 'tileset', 'tilemap'])('makes a %s and names it in the answer', async (kind) => {
    const made = await create(kind, kind === 'sprite' ? { sprite: { name: 'made', width: 8, height: 8 } } : {});
    expect(made).toMatchObject({ ok: true, asset: { kind } });
    const view = current.rig.kit.host.view(String(fieldOf(made, 'documentId')) as never);
    expect(view?.state.artwork.name).toBe(`made ${kind}`);
  });

  it('puts the sprite on the new sheet, and the tileset under the new map', async () => {
    const sheet = await create('sheet');
    const sheetArt = current.rig.kit.host.view(String(fieldOf(sheet, 'documentId')) as never)?.state.artwork;
    expect(sheetArt?.sheets[0]?.entries).toHaveLength(1);
    const map = await create('tilemap', { mapSize: { columns: 4, rows: 3 }, tileSize: { width: 8, height: 8 } });
    const mapArt = current.rig.kit.host.view(String(fieldOf(map, 'documentId')) as never)?.state.artwork;
    expect(mapArt?.tilemaps[0]).toMatchObject({ tilesetId: mapArt?.tilesets[0]?.id });
    expect(mapArt?.tilesets[0]).toMatchObject({ tileWidth: 8, tileHeight: 8 });
  });
});

describe('save_document with an asset', () => {
  const saveOne = (extra: object) => current.run('save_document', { documentId: documentOf(), ...extra }, current.grants('edit'));

  it('writes only the asset it names', async () => {
    const [first, second] = artwork.sprites;
    paintSprite(documentOf() as never, first?.id as never);
    paintSprite(documentOf() as never, second?.id as never);
    current.rig.disk.writes.length = 0;
    const saved = await saveOne({ asset: { kind: 'sprite', id: first?.id }, target: 'current' });
    expect(saved).toMatchObject({ ok: true, asset: { kind: 'sprite', id: first?.id } });
    expect(current.rig.disk.writes).toEqual([paths.get(first?.id ?? '')]);
  });

  it('is refused for a project granted read only, and for a read only session', async () => {
    paintSprite(documentOf() as never, artwork.sprites[0]?.id as never);
    const readGrant = await current.run('save_document', { documentId: documentOf(), target: 'current' }, current.grants('read'));
    expect(readGrant).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    const readSession = await current.run('save_document', { documentId: documentOf(), target: 'current' }, current.grants('edit'), 'read');
    expect(readSession).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    const ungranted = await current.run('save_document', { documentId: documentOf(), target: 'current' }, []);
    expect(ungranted).toMatchObject({ ok: false, error: { code: 'DOCUMENT_NOT_FOUND' } });
    expect(current.rig.disk.writes).toEqual([]);
  });

  it('writes a copy at a new place and leaves the asset where it was', async () => {
    const hero = spriteOf('slime');
    const before = useWorkspaceStore.getState().workspaces[documentOf()]?.paths.get(hero.id);
    const saved = await saveOne({ asset: { kind: 'sprite', id: hero.id }, target: { location: current.locate('sprites/slime copy.bxsprite'), overwrite: false, moveAsset: false } });
    expect(saved).toMatchObject({ ok: true, fileName: 'slime copy.bxsprite' });
    expect(current.rig.disk.files.has(`${ROOT}/sprites/slime copy.bxsprite`)).toBe(true);
    expect(useWorkspaceStore.getState().workspaces[documentOf()]?.paths.get(hero.id)).toBe(before);
  });

  it('moves the asset to the new place when asked to', async () => {
    const hero = spriteOf('slime');
    await saveOne({ asset: { kind: 'sprite', id: hero.id }, target: { location: current.locate('sprites/moved.bxsprite'), overwrite: false, moveAsset: true } });
    expect(useWorkspaceStore.getState().workspaces[documentOf()]?.paths.get(hero.id)).toBe(`${ROOT}/sprites/moved.bxsprite`);
  });

  it('refuses a new place in a project granted read only', async () => {
    const refused = await current.run('save_document', { documentId: documentOf(), target: { location: current.locate('sprites/x.bxsprite'), overwrite: false, moveAsset: false } }, current.grants('read'));
    expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
  });
});

describe('split_legacy_file', () => {
  beforeEach(() => {
    current.rig.disk.files.set(`${ROOT}/old.bxel`, legacyBytes({ ...sampleArtwork(), name: 'Older' }));
  });

  it('writes one file per asset into the project folders and leaves the older file', async () => {
    const original = current.rig.disk.files.get(`${ROOT}/old.bxel`);
    const split = await current.run('split_legacy_file', { file: current.locate('old.bxel') }, current.grants('edit'));
    const files = rowsOf(split, 'files');
    const plan = splitIntoAssets(sampleArtwork());
    expect(files).toHaveLength(plan.files.length);
    expect(files.map((file) => file.kind).sort()).toEqual(plan.files.map((file) => file.key.kind).sort());
    expect(files.every((file) => current.rig.disk.files.has(`${ROOT}/${(file.location as { path: string }).path}`))).toBe(true);
    expect(current.rig.disk.files.get(`${ROOT}/old.bxel`)).toBe(original);
  });

  it('is refused when the project is granted read only, and for a file that is not an older one', async () => {
    const refused = await current.run('split_legacy_file', { file: current.locate('old.bxel') }, current.grants('read'));
    expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    const wrong = await current.run('split_legacy_file', { file: current.locate('sprites/slime.bxsprite') }, current.grants('edit'));
    expect(wrong).toMatchObject({ ok: false, error: { code: 'FILE_NOT_SUPPORTED' } });
  });
});
