/* @layer renderer-app @kind test */
import { readAssetManifest } from '@bxel/document/native';
import { resolveLinkPath } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { copyEntries } from '../../src/file-ops/copy-entries';
import { holdFiles } from '../../src/file-ops/hold-files';
import { moveEntries } from '../../src/file-ops/move-entries';
import { pasteFiles } from '../../src/file-ops/paste-files';
import { undoMove } from '../../src/file-ops/undo-move';
import { writeDropped } from '../../src/file-ops/write-dropped';
import { useFileClipboardStore } from '../../src/stores/useFileClipboardStore';
import { useMoveJournalStore } from '../../src/stores/useMoveJournalStore';
import { ROOT } from '../project/project-harness';
import { toast } from '../project/project-mocks';
import { heldRig } from '../workspace/held-rig';
import { artworkOf, openSampleProject } from '../workspace/open-sample-project';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const held = heldRig();

const FOLDER = `${ROOT}/journal-target`;

const open = async (): Promise<{ readonly spritePath: string; readonly sheetPaths: readonly string[] }> => {
  const { documentId, paths } = await openSampleProject(held.rig);
  const artwork = artworkOf(documentId);
  const sprite = artwork.sprites[0];
  if (!sprite) throw new Error('no sprite');
  held.rig.disk.dirs.add(FOLDER);
  return { spritePath: paths.get(sprite.id) ?? '', sheetPaths: artwork.sheets.map((sheet) => paths.get(sheet.id) ?? '') };
};

const linkTargets = (path: string): readonly string[] => {
  const bytes = held.rig.disk.files.get(path);
  if (!(bytes instanceof Uint8Array)) throw new Error(`no file at ${path}`);
  const manifest = readAssetManifest(bytes);
  if (!manifest) throw new Error('the file did not decode');
  return manifest.links.map((link) => resolveLinkPath(path, link.path));
};

const nameOf = (path: string): string => path.slice(path.lastIndexOf('/') + 1);

beforeEach(() => {
  useMoveJournalStore.getState().clear();
  useFileClipboardStore.getState().clear();
  toast.mockClear();
});

describe('K3 the move journal', { tags: ['standard'] }, () => {
  it('records a move and undoes the latest one, restoring the file and the links that pointed at it', async () => {
    const { spritePath, sheetPaths } = await open();
    const moved = `${FOLDER}/${nameOf(spritePath)}`;
    expect((await moveEntries([spritePath], FOLDER)).ok).toBe(true);
    expect(useMoveJournalStore.getState().entries).toHaveLength(1);
    for (const sheet of sheetPaths) expect(linkTargets(sheet)).toContain(moved);
    expect((await undoMove()).ok).toBe(true);
    expect(held.rig.disk.files.has(spritePath)).toBe(true);
    expect(held.rig.disk.files.has(moved)).toBe(false);
    for (const sheet of sheetPaths) expect(linkTargets(sheet)).toContain(spritePath);
    expect(useMoveJournalStore.getState().entries).toHaveLength(0);
  });

  it('says so, and changes nothing, when there is no move to undo', async () => {
    await open();
    const outcome = await undoMove();
    expect(outcome.ok).toBe(false);
    expect(toast).toHaveBeenCalledWith(expect.stringContaining('no file move'), expect.anything());
  });

  it('keeps only the newest moves up to the limit', () => {
    const { record } = useMoveJournalStore.getState();
    for (let count = 0; count < 60; count += 1) record(`move ${count}`, [{ from: `a${count}`, to: `b${count}` }]);
    const { entries } = useMoveJournalStore.getState();
    expect(entries).toHaveLength(50);
    expect(entries.at(-1)?.label).toBe('move 59');
  });
});

describe('K3 copying and pasting files', { tags: ['standard'] }, () => {
  it('copies a file into another folder and leaves the original', async () => {
    const { spritePath } = await open();
    const outcome = await copyEntries([spritePath], FOLDER);
    expect(outcome.ok).toBe(true);
    expect(held.rig.disk.files.has(`${FOLDER}/${nameOf(spritePath)}`)).toBe(true);
    expect(held.rig.disk.files.has(spritePath)).toBe(true);
  });

  it('names a copy beside its original with a copy suffix instead of overwriting', async () => {
    const { spritePath } = await open();
    const folder = spritePath.slice(0, spritePath.lastIndexOf('/'));
    expect((await copyEntries([spritePath], folder)).ok).toBe(true);
    const copies = [...held.rig.disk.files.keys()].filter((path) => path.startsWith(folder) && nameOf(path).includes('copy'));
    expect(copies).toHaveLength(1);
  });

  it('points the links of a copied file at the copies of the files copied with it, and at the originals otherwise', async () => {
    const { spritePath, sheetPaths } = await open();
    const [sheetPath] = sheetPaths;
    if (sheetPath === undefined) throw new Error('no sheet');
    expect((await copyEntries([sheetPath], FOLDER)).ok).toBe(true);
    expect(linkTargets(`${FOLDER}/${nameOf(sheetPath)}`)).toContain(spritePath);
    expect((await copyEntries([sheetPath, spritePath], FOLDER)).ok).toBe(true);
    const together = [...held.rig.disk.files.keys()].filter((path) => path.startsWith(FOLDER) && nameOf(path).includes('copy'));
    expect(together.length).toBeGreaterThan(0);
  });

  it('pastes a cut as a move and then empties the clipboard', async () => {
    const { spritePath } = await open();
    holdFiles([spritePath], true);
    expect(await pasteFiles(FOLDER)).toBe(true);
    expect(held.rig.disk.files.has(`${FOLDER}/${nameOf(spritePath)}`)).toBe(true);
    expect(held.rig.disk.files.has(spritePath)).toBe(false);
    expect(useFileClipboardStore.getState().clip).toBeNull();
    expect(useMoveJournalStore.getState().entries).toHaveLength(1);
  });

  it('pastes a copy more than once', async () => {
    const { spritePath } = await open();
    holdFiles([spritePath], false);
    expect(await pasteFiles(FOLDER)).toBe(true);
    expect(await pasteFiles(FOLDER)).toBe(true);
    expect(useFileClipboardStore.getState().clip).not.toBeNull();
    expect(held.rig.disk.files.has(spritePath)).toBe(true);
  });

  it('tells the owner when nothing was cut or copied', async () => {
    await open();
    expect(await pasteFiles(FOLDER)).toBe(false);
    expect(toast).toHaveBeenCalledWith(expect.stringContaining('Cut or copy'), expect.anything());
  });
});

describe('K3 files dropped from the operating system', { tags: ['standard'] }, () => {
  it('writes each file into the folder and numbers a name that is already taken', async () => {
    await open();
    const first = new File([new Uint8Array([1, 2, 3])], 'notes.bin');
    const result = await writeDropped(held.rig.disk.port, FOLDER, [first, first]);
    expect(result.failed).toEqual([]);
    expect(result.written).toEqual([`${FOLDER}/notes.bin`, `${FOLDER}/notes 2.bin`]);
    expect(held.rig.disk.files.get(`${FOLDER}/notes.bin`)).toEqual(new Uint8Array([1, 2, 3]));
  });

  it('reports every file as failed when the folder cannot be read', async () => {
    await open();
    const result = await writeDropped(held.rig.disk.port, `${ROOT}/no-such-folder`, [new File([new Uint8Array([1])], 'a.bin')]);
    expect(result.written).toEqual([]);
    expect(result.failed).toEqual(['a.bin']);
  });
});
