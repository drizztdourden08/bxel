/* @layer renderer-app @kind test */
import { resolveLinkPath } from '@bxel/document';
import type { AssetKey } from '@bxel/document';
import { describe, expect, it, vi } from 'vitest';
import { relocate } from '../../src/file-ops/relocate';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { renameAsset } from '../../src/workspace/rename-asset';
import { heldRig } from '../workspace/held-rig';
import { manifestIn } from '../project/links-in';
import { artworkOf, openSampleProject, workspaceOf } from '../workspace/open-sample-project';
import { ROOT } from '../project/project-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const held = heldRig();

const DESTINATION = `${ROOT}/destination`;

const manifestAt = (path: string) => manifestIn(held.rig.disk, path);

describe('K3 moving a file that a file with unsaved edits links to', { tags: ['standard'] }, () => {
  it('writes the new link into the file on disk, keeps the edits unsaved, and does not save them', async () => {
    const { documentId, paths } = await openSampleProject(held.rig);
    held.rig.disk.dirs.add(DESTINATION);
    const artwork = artworkOf(documentId);
    const sprite = artwork.sprites[0];
    const sheet = artwork.sheets[0];
    if (!sprite || !sheet) throw new Error('the sample has a sprite and a sheet');
    const spritePath = paths.get(sprite.id) ?? '';
    const sheetPath = paths.get(sheet.id) ?? '';
    const key: AssetKey = { kind: 'sheet', id: sheet.id };
    const savedName = manifestAt(sheetPath).name;
    expect(renameAsset(useDocumentStore.getState().host, documentId, key, 'unsaved name')).toBe(true);
    expect(workspaceOf(documentId).dirty.has(`sheet:${sheet.id}`)).toBe(true);

    const target = `${DESTINATION}/${spritePath.slice(spritePath.lastIndexOf('/') + 1)}`;
    const outcome = await relocate([{ from: spritePath, to: target }]);

    expect(outcome.ok).toBe(true);
    const onDisk = manifestAt(sheetPath);
    expect(onDisk.links.map((link) => resolveLinkPath(sheetPath, link.path))).toContain(target);
    expect(onDisk.links.map((link) => resolveLinkPath(sheetPath, link.path))).not.toContain(spritePath);
    expect(onDisk.name).toBe(savedName);
    expect(workspaceOf(documentId).dirty.has(`sheet:${sheet.id}`)).toBe(true);
    expect(artworkOf(documentId).sheets.find((each) => each.id === sheet.id)?.name).toBe('unsaved name');
  });

  it('rewrites the links of the moved file itself, which are relative to where it was', async () => {
    const { documentId, paths } = await openSampleProject(held.rig);
    held.rig.disk.dirs.add(DESTINATION);
    const sprite = artworkOf(documentId).sprites[0];
    if (!sprite) throw new Error('the sample has a sprite');
    const spritePath = paths.get(sprite.id) ?? '';
    const before = manifestAt(spritePath).links.map((link) => resolveLinkPath(spritePath, link.path));
    expect(before.length).toBeGreaterThan(0);
    const target = `${DESTINATION}/${spritePath.slice(spritePath.lastIndexOf('/') + 1)}`;
    await relocate([{ from: spritePath, to: target }]);
    expect(manifestAt(target).links.map((link) => resolveLinkPath(target, link.path))).toEqual(before);
  });

  it('keeps a clean file clean after its links are rewritten', async () => {
    const { documentId, paths } = await openSampleProject(held.rig);
    held.rig.disk.dirs.add(DESTINATION);
    const sprite = artworkOf(documentId).sprites[0];
    const sheet = artworkOf(documentId).sheets[0];
    if (!sprite || !sheet) throw new Error('the sample has a sprite and a sheet');
    const spritePath = paths.get(sprite.id) ?? '';
    await relocate([{ from: spritePath, to: `${DESTINATION}/${spritePath.slice(spritePath.lastIndexOf('/') + 1)}` }]);
    expect(workspaceOf(documentId).dirty.has(`sheet:${sheet.id}`)).toBe(false);
    expect(workspaceOf(documentId).dirty.has(`sprite:${sprite.id}`)).toBe(false);
    expect(held.rig.disk.files.has(paths.get(sheet.id) ?? '')).toBe(true);
  });
});
