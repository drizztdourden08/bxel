/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { applyLinkFixes } from '../../src/project-health/apply-link-fixes';
import { refreshHealth } from '../../src/project-health/refresh-health';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { focusTab } from '../../src/workspace/focus-tab';
import { keyId } from '../../src/workspace/key-id';
import { tabOf } from '../../src/workspace/tab-of';
import { ROOT } from '../project/project-harness';
import { toast } from '../project/project-mocks';
import { heldRig } from '../workspace/held-rig';
import { openSampleProject, workspaceOf } from '../workspace/open-sample-project';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const held = heldRig();

const MOVED_TO = `${ROOT}/palettes/relinked/moved.bxpalette`;

const openWithMovedPalette = async () => {
  const { documentId, artwork, paths } = await openSampleProject(held.rig);
  const sprite = artwork.sprites[0];
  const bank = artwork.banks.find((each) => each.id === sprite?.bankId);
  const spritePath = paths.get(sprite?.id ?? '') ?? '';
  const palettePath = paths.get(bank?.id ?? '') ?? '';
  const { files, dirs } = held.rig.disk;
  dirs.add(MOVED_TO.slice(0, MOVED_TO.lastIndexOf('/')));
  files.set(MOVED_TO, files.get(palettePath) ?? new Uint8Array());
  files.delete(palettePath);
  await refreshHealth();
  return { documentId, bankId: bank?.id ?? '', spriteId: sprite?.id ?? '', spritePath, palettePath };
};

const relink = (spritePath: string, linkId: string) => applyLinkFixes([{ file: spritePath, linkId, by: 'path', to: MOVED_TO }]);

describe('K1 the open document after a relink', { tags: ['standard'] }, () => {
  it('reloads the open project at once, so the document holds the new path of the link', async () => {
    const { documentId, bankId, spritePath } = await openWithMovedPalette();
    expect(workspaceOf(documentId).paths.get(bankId)).not.toBe(MOVED_TO);
    await relink(spritePath, bankId);
    const reopened = Object.values(useWorkspaceStore.getState().workspaces)[0];
    expect(reopened?.documentId).not.toBe(documentId);
    expect(reopened?.paths.get(bankId)).toBe(MOVED_TO);
  });

  it('keeps the open tabs of the project after the reload', async () => {
    const { documentId, bankId, spriteId, spritePath } = await openWithMovedPalette();
    focusTab(tabOf(documentId, { kind: 'sprite', id: spriteId }));
    await relink(spritePath, bankId);
    const tabs = useWorkspaceStore.getState().tabs;
    expect(tabs.some((tab) => tab.key.id === spriteId)).toBe(true);
    expect(useWorkspaceStore.getState().activeTab).not.toBeNull();
  });

  it('keeps the document and says so when it has unsaved changes', async () => {
    const { documentId, bankId, spriteId, spritePath } = await openWithMovedPalette();
    useWorkspaceStore.getState().patch(documentId, (workspace) => ({ ...workspace, dirty: new Set([keyId({ kind: 'sprite', id: spriteId })]) }));
    toast.mockClear();
    await relink(spritePath, bankId);
    expect(Object.values(useWorkspaceStore.getState().workspaces)[0]?.documentId).toBe(documentId);
    expect(toast).toHaveBeenCalledWith(expect.stringContaining('unsaved changes'), { variant: 'warning' });
  });
});
