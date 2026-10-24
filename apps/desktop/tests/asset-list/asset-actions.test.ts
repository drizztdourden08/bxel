/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildRows } from '../../src/asset-list/build-rows';
import { copyForSheet } from '../../src/asset-list/copy-for-sheet';
import { duplicateRow } from '../../src/asset-list/duplicate-row';
import { listProjectFiles } from '../../src/asset-list/list-project-files';
import { renameRow } from '../../src/asset-list/rename-row';
import { trashRow } from '../../src/asset-list/trash-row';
import type { AssetRow } from '../../src/asset-list/asset-list.type';
import { openProject } from '../../src/project/open-project';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { tabOf } from '../../src/workspace/tab-of';
import { rig, ROOT, withManifest } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { artworkOf, openSampleProject } from '../workspace/open-sample-project';
import { paintSprite, sampleArtwork, writeProjectAssets } from '../workspace/workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

let held: Rig;

const opened = () => openSampleProject(held);

const rowsOf = async (): Promise<readonly AssetRow[]> => {
  const workspace = Object.values(useWorkspaceStore.getState().workspaces).find((each) => each.kind === 'project');
  const project = useProjectStore.getState().project;
  const artwork = workspace ? useDocumentStore.getState().host.view(workspace.documentId)?.state.artwork : undefined;
  if (!workspace || !artwork || !project) throw new Error('no project');
  return buildRows({ workspace, artwork, files: await listProjectFiles(held.disk.port, project) });
};

const rowNamed = (rows: readonly AssetRow[], kind: string, name: string): AssetRow => {
  const found = rows.find((each) => each.kind === kind && each.name === name);
  if (!found) throw new Error(`no ${kind} named ${name}`);
  return found;
};

beforeEach(() => {
  held = rig();
});

describe('the asset rows of a project', () => {
  it('lists every asset with its folder and the sheets that use each sprite', async () => {
    await opened();
    const rows = await rowsOf();
    expect(rows.filter((row) => row.kind === 'sprite').length).toBe(2);
    expect(rows.filter((row) => row.kind === 'sheet').map((row) => row.name).sort()).toEqual(['idle', 'walk']);
    expect(rows.every((row) => row.loaded && !row.dirty)).toBe(true);
    const sprite = rows.find((row) => row.kind === 'sprite');
    expect(sprite?.usedBy.length).toBe(2);
    expect(sprite?.folder).toBe('sprites');
    expect(rows.find((row) => row.kind === 'sheet')?.folder).toBe('sheets');
  });

  it('marks a painted sprite dirty and shows images and other files that are not assets', async () => {
    const { documentId, artwork } = await opened();
    held.disk.files.set(`${ROOT}/art/ref.png`, new Uint8Array(3));
    held.disk.files.set(`${ROOT}/notes.txt`, 'hello');
    paintSprite(documentId, artwork.sprites[0]?.id ?? ('' as never));
    const rows = await rowsOf();
    expect(rows.filter((row) => row.dirty).map((row) => row.kind)).toEqual(['sprite']);
    expect(rows.find((row) => row.name === 'ref.png')?.kind).toBe('image');
    expect(rows.find((row) => row.name === 'notes.txt')?.kind).toBe('other');
    expect(rows.some((row) => row.name.endsWith('.bxproject'))).toBe(false);
  });

  it('lists a file that did not load as not opened', async () => {
    await opened();
    held.disk.files.set(`${ROOT}/sprites/late.bxsprite`, new Uint8Array(3));
    const late = (await rowsOf()).find((row) => row.name === 'late');
    expect(late).toMatchObject({ kind: 'sprite', loaded: false, assetId: null });
  });
});

describe('the row actions', () => {
  it('Duplicate makes a sprite copy that sits on the same sheets', async () => {
    const { documentId } = await opened();
    duplicateRow(rowNamed(await rowsOf(), 'sprite', artworkOf(documentId).sprites[0]?.name ?? ''));
    const sprites = artworkOf(documentId).sprites.map((sprite) => sprite.name);
    expect(sprites.some((name) => name.endsWith(' copy'))).toBe(true);
    const copy = artworkOf(documentId).sprites.find((sprite) => sprite.name.endsWith(' copy'));
    const holds = (sheet: { readonly entries: readonly { readonly spriteId: string }[] }): boolean => sheet.entries.some((entry) => entry.spriteId === copy?.id);
    expect(artworkOf(documentId).sheets.every(holds)).toBe(true);
  });

  it('Duplicate of a sheet copies its layout and entries', async () => {
    const { documentId } = await opened();
    duplicateRow(rowNamed(await rowsOf(), 'sheet', 'walk'));
    const sheets = artworkOf(documentId).sheets;
    const original = sheets.find((sheet) => sheet.name === 'walk');
    const copy = sheets.find((sheet) => sheet.name === 'walk copy');
    expect(copy?.entries.map((entry) => entry.spriteId)).toEqual(original?.entries.map((entry) => entry.spriteId));
    expect(copy?.layout).toEqual(original?.layout);
  });

  it('Copy for this sheet repoints one sheet to its own copy of the sprite', async () => {
    const { documentId } = await opened();
    const workspaceTab = tabOf(documentId, { kind: 'sheet', id: artworkOf(documentId).sheets.find((sheet) => sheet.name === 'walk')?.id ?? '' });
    useWorkspaceStore.getState().addTab(workspaceTab);
    useWorkspaceStore.getState().setActiveTab(workspaceTab.id);
    const rows = await rowsOf();
    const sprite = rows.find((row) => row.kind === 'sprite');
    if (!sprite) throw new Error('no sprite row');
    copyForSheet(sprite);
    const after = artworkOf(documentId);
    const walk = after.sheets.find((sheet) => sheet.name === 'walk');
    const idle = after.sheets.find((sheet) => sheet.name === 'idle');
    expect(walk?.entries.some((entry) => entry.spriteId === sprite.assetId)).toBe(false);
    expect(idle?.entries.some((entry) => entry.spriteId === sprite.assetId)).toBe(true);
    const copy = after.sprites.find((each) => each.name === `${sprite.name} copy`);
    expect(walk?.entries.some((entry) => entry.spriteId === copy?.id)).toBe(true);
    expect(idle?.entries.some((entry) => entry.spriteId === copy?.id)).toBe(false);
  });

  it('Move to trash removes the asset from the workspace and the file leaves at save', async () => {
    const { documentId, paths } = await opened();
    const sheet = rowNamed(await rowsOf(), 'sheet', 'idle');
    trashRow(sheet);
    expect(artworkOf(documentId).sheets.some((each) => each.name === 'idle')).toBe(false);
    expect((await rowsOf()).some((row) => row.name === 'idle')).toBe(false);
    expect(held.disk.files.has(paths.get(sheet.assetId ?? '') ?? '')).toBe(true);
  });

  it('Rename changes the asset name and the file follows at save', async () => {
    const { documentId } = await opened();
    const sheet = rowNamed(await rowsOf(), 'sheet', 'idle');
    expect((await renameRow(sheet, 'rest')).ok).toBe(true);
    expect(artworkOf(documentId).sheets.some((each) => each.name === 'rest')).toBe(true);
    expect((await renameRow(sheet, 'walk')).ok).toBe(false);
  });
});

describe('a file renamed in Explorer', () => {
  it('gives its name to the asset when the project loads, and marks it unsaved', async () => {
    const artwork = sampleArtwork();
    const paths = writeProjectAssets(held.disk, ROOT, artwork);
    const sheet = artwork.sheets.find((each) => each.name === 'walk');
    const from = paths.get(sheet?.id ?? '') ?? '';
    const to = `${ROOT}/sheets/run.bxsheet`;
    held.disk.files.set(to, held.disk.files.get(from) ?? '');
    held.disk.files.delete(from);
    withManifest(held.disk);
    held.disk.picks.folder = ROOT;
    await openProject();
    const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
    const names = workspace ? artworkOf(workspace.documentId).sheets.map((each) => each.name) : [];
    expect(names).toContain('run');
    expect(names).not.toContain('walk');
    expect([...(workspace?.dirty ?? [])]).toEqual([`sheet:${sheet?.id}`]);
  });
});
