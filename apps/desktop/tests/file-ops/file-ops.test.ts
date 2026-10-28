/* @layer renderer-app @kind test */
import { readAssetManifest } from '@bxel/document/native';
import { resolveLinkPath } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import { describe, expect, it, vi } from 'vitest';
import { moveEntries } from '../../src/file-ops/move-entries';
import { relocate } from '../../src/file-ops/relocate';
import { renameEntryLinked } from '../../src/file-ops/rename-entry-linked';
import { trashEntries } from '../../src/file-ops/trash-entries';
import { assetKeys } from '../../src/workspace/asset-keys';
import { confirmAction, toast } from '../project/project-mocks';
import { ROOT } from '../project/project-harness';
import { heldRig } from '../workspace/held-rig';
import { artworkOf, openSampleProject, workspaceOf } from '../workspace/open-sample-project';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const held = heldRig();

const NEW_FOLDER = `${ROOT}/hero-art`;

type Opened = { readonly documentId: DocumentId; readonly spritePath: string; readonly sheetPaths: readonly string[] };

const open = async (): Promise<Opened> => {
  const { documentId, paths } = await openSampleProject(held.rig);
  const artwork = artworkOf(documentId);
  const sprite = artwork.sprites[0];
  if (!sprite) throw new Error('no sprite');
  const spritePath = paths.get(sprite.id) ?? '';
  const sheetPaths = artwork.sheets.map((sheet) => paths.get(sheet.id) ?? '');
  held.rig.disk.dirs.add(NEW_FOLDER);
  return { documentId, spritePath, sheetPaths };
};

const linkTargets = (path: string): readonly string[] => {
  const bytes = held.rig.disk.files.get(path);
  if (!(bytes instanceof Uint8Array)) throw new Error(`no file at ${path}`);
  const manifest = readAssetManifest(bytes);
  if (!manifest) throw new Error('the sheet did not decode');
  return manifest.links.map((link) => resolveLinkPath(path, link.path));
};

const moved = (path: string, folder: string): string => `${folder}/${path.slice(path.lastIndexOf('/') + 1)}`;

const undoOf = (options: unknown): (() => void) => {
  const action = typeof options === 'object' && options !== null && 'action' in options ? options.action : null;
  if (typeof action !== 'object' || action === null || !('onSelect' in action) || typeof action.onSelect !== 'function') throw new Error('the toast has no undo');
  const run: unknown = action.onSelect;
  return () => void (run as () => void)();
};

const backAt = (spritePath: string, sheetPaths: readonly string[]): Promise<void> =>
  vi.waitFor(() => {
    expect(held.rig.disk.files.has(spritePath)).toBe(true);
    for (const sheet of sheetPaths) expect(linkTargets(sheet)).toContain(spritePath);
  });

const onlySprite = (documentId: DocumentId): string => {
  const sprite = artworkOf(documentId).sprites[0];
  return sprite ? (workspaceOf(documentId).paths.get(sprite.id) ?? '') : '';
};

describe('moving a file the project links to', () => {
  it('rewrites the files that link to it, and the workspace follows the new path', async () => {
    const { documentId, spritePath, sheetPaths } = await open();
    expect(sheetPaths.length).toBeGreaterThan(0);
    for (const sheet of sheetPaths) expect(linkTargets(sheet)).toContain(spritePath);
    const outcome = await relocate([{ from: spritePath, to: moved(spritePath, NEW_FOLDER) }]);
    expect(outcome).toEqual({ ok: true, rewritten: sheetPaths.length });
    for (const sheet of sheetPaths) {
      expect(linkTargets(sheet)).toContain(moved(spritePath, NEW_FOLDER));
      expect(linkTargets(sheet)).not.toContain(spritePath);
    }
    expect(onlySprite(documentId)).toBe(moved(spritePath, NEW_FOLDER));
    expect(held.rig.disk.files.has(spritePath)).toBe(false);
  });

  it('asks only when other files are touched, and does nothing when the owner says no', async () => {
    const { spritePath } = await open();
    confirmAction.mockImplementationOnce(() => Promise.resolve(false));
    const refused = await moveEntries([spritePath], NEW_FOLDER);
    expect(refused.ok).toBe(false);
    expect(JSON.stringify(confirmAction.mock.calls.at(-1)?.[0])).toContain('updates links in');
    expect(held.rig.disk.renamed).toEqual([]);
    expect(held.rig.disk.files.has(spritePath)).toBe(true);
  });

  it('offers one undo in the toast that moves the file back and rewrites the links again', async () => {
    const { documentId, spritePath, sheetPaths } = await open();
    const outcome = await moveEntries([spritePath], NEW_FOLDER);
    expect(outcome.ok).toBe(true);
    undoOf(toast.mock.calls.at(-1)?.[1])();
    await backAt(spritePath, sheetPaths);
    expect(onlySprite(documentId)).toBe(spritePath);
  });

  it('refuses a folder moved into itself and a name already taken there', async () => {
    const { spritePath } = await open();
    held.rig.disk.files.set(moved(spritePath, NEW_FOLDER), new Uint8Array(1));
    expect((await moveEntries([spritePath], NEW_FOLDER)).ok).toBe(false);
    expect((await moveEntries([NEW_FOLDER], `${NEW_FOLDER}/inner`)).ok).toBe(false);
    expect(held.rig.disk.renamed).toEqual([]);
  });
});

describe('renaming a file the project links to', () => {
  it('keeps the ending, renames the asset with the file and rewrites the files that link to it', async () => {
    const { documentId, spritePath, sheetPaths } = await open();
    const renamed = `${spritePath.slice(0, spritePath.lastIndexOf('/'))}/blob.bxsprite`;
    expect(await renameEntryLinked(spritePath, 'blob', false)).toEqual({ ok: true, rewritten: sheetPaths.length });
    expect(held.rig.disk.files.has(renamed)).toBe(true);
    for (const sheet of sheetPaths) expect(linkTargets(sheet)).toContain(renamed);
    expect(artworkOf(documentId).sprites[0]?.name).toBe('blob');
    expect(assetKeys(artworkOf(documentId)).length).toBeGreaterThan(0);
  });

  it('offers an undo that puts the file and the asset name back and rewrites the links again', async () => {
    const { documentId, spritePath, sheetPaths } = await open();
    const name = artworkOf(documentId).sprites[0]?.name ?? '';
    await renameEntryLinked(spritePath, 'blob', false);
    undoOf(toast.mock.calls.at(-1)?.[1])();
    await backAt(spritePath, sheetPaths);
    expect(artworkOf(documentId).sprites[0]?.name).toBe(name);
  });

  it('refuses a name that is taken or breaks the rules, and changes nothing', async () => {
    const { spritePath } = await open();
    const sibling = `${spritePath.slice(0, spritePath.lastIndexOf('/'))}/Other.bxsprite`;
    held.rig.disk.files.set(sibling, new Uint8Array(1));
    expect((await renameEntryLinked(spritePath, 'other', false)).ok).toBe(false);
    expect((await renameEntryLinked(spritePath, 'a/b', false)).ok).toBe(false);
    expect(held.rig.disk.renamed).toEqual([]);
  });
});

describe('moving files to the trash', () => {
  it('names the files that will lose a link, and trashes after a yes', async () => {
    const { spritePath, sheetPaths } = await open();
    expect(await trashEntries([spritePath])).toBe(true);
    expect(JSON.stringify(confirmAction.mock.calls.at(-1)?.[0])).toContain(`Used by ${sheetPaths.length} files`);
    expect(held.rig.disk.trashed).toEqual([spritePath]);
  });

  it('does nothing when the owner says no', async () => {
    const { spritePath } = await open();
    confirmAction.mockImplementationOnce(() => Promise.resolve(false));
    expect(await trashEntries([spritePath])).toBe(false);
    expect(held.rig.disk.trashed).toEqual([]);
  });

  it('says nothing about links for a file nothing uses', async () => {
    const { sheetPaths } = await open();
    expect(await trashEntries([sheetPaths[0] ?? ''])).toBe(true);
    expect(JSON.stringify(confirmAction.mock.calls.at(-1)?.[0])).not.toContain('Used by');
  });
});
