/* @layer renderer-app @kind test */
import type { Artwork, DocumentId } from '@bxel/document';
import { decodeProject } from '@bxel/project';
import type { ProjectDocument } from '@bxel/project';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { openPath } from '../../src/workspace/open-path';
import { runSplit } from '../../src/workspace/run-split';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { rig } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { legacyBytes, sampleArtwork, writeProjectAssets } from './workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const PARENT = 'C:/Art';

let held: Rig;

const byId = (left: { id: string }, right: { id: string }): number => left.id.localeCompare(right.id);

const workspaces = () => Object.values(useWorkspaceStore.getState().workspaces);

const artworkOf = (documentId: DocumentId): Artwork => {
  const found = useDocumentStore.getState().host.view(documentId)?.state.artwork;
  if (!found) throw new Error('no document');
  return found;
};

const writeOlderFile = (artwork: Artwork): string => {
  const path = `${PARENT}/old.bxel`;
  held.disk.files.set(path, legacyBytes(artwork));
  return path;
};

const savedProject = (bytes: string | Uint8Array | undefined): ProjectDocument => {
  const decoded = bytes instanceof Uint8Array ? decodeProject(bytes) : null;
  if (!decoded?.ok) throw new Error('the project file did not read');
  return decoded.value.manifest;
};

const singleSprite = (artwork: Artwork): Artwork => ({ ...artwork, sprites: artwork.sprites.slice(0, 1), sheets: [] });

beforeEach(() => {
  held = rig();
  held.disk.granted.add(PARENT.toLowerCase());
  held.disk.dirs.add(PARENT);
});

describe('an older .bxel file', () => {
  it('with one sprite and nothing else opens as an unsaved sprite', async () => {
    const path = writeOlderFile(singleSprite(sampleArtwork()));
    expect((await openPath(held.kit, path)).kind).toBe('done');
    const [workspace] = workspaces();
    expect(workspace?.kind).toBe('loose');
    expect(workspace?.legacy).toBeNull();
    expect(workspace?.dirty.size).toBe(1);
    expect(useDocumentStore.getState().host.view(workspace?.documentId ?? ('' as DocumentId))?.state.readOnly).toBe(false);
  });

  it('with several assets opens read only, counts them, and refuses to save', async () => {
    const path = writeOlderFile(sampleArtwork());
    await openPath(held.kit, path);
    const [workspace] = workspaces();
    expect(workspace?.legacy?.counts).toEqual({ sprites: 2, sheets: 2, palettes: 1 });
    expect(useDocumentStore.getState().host.view(workspace?.documentId ?? ('' as DocumentId))?.state.readOnly).toBe(true);
    expect((await saveWorkspace(held.kit, workspace?.documentId ?? ('' as DocumentId))).kind).toBe('failed');
  });

  it('splits into a new project beside it that reopens identical, and leaves the older file alone', async () => {
    const artwork = sampleArtwork();
    const path = writeOlderFile(artwork);
    const before = held.disk.files.get(path);
    await openPath(held.kit, path);
    const legacy = workspaces()[0];
    if (!legacy) throw new Error('no workspace');
    held.disk.picks.folder = PARENT;
    expect(await runSplit(legacy.documentId, 'beside')).toEqual({ kind: 'done' });
    expect(held.disk.files.has(`${PARENT}/Untitled/Untitled.bxproject`)).toBe(true);
    expect(held.disk.files.get(path)).toBe(before);
    const [project] = workspaces();
    expect(workspaces()).toHaveLength(1);
    expect(project?.kind).toBe('project');
    const reopened = artworkOf(project?.documentId ?? ('' as DocumentId));
    expect([...reopened.sprites].sort(byId)).toEqual([...artwork.sprites].sort(byId));
    expect([...reopened.sheets].sort(byId)).toEqual([...artwork.sheets].sort(byId));
    expect(reopened.banks).toEqual(artwork.banks);
    expect(project?.dirty.size).toBe(0);
  });
});

describe('splitting an older file keeps its project settings', () => {
  it('writes the cover, the default palette and the platform to the project file and loads them again', async () => {
    const base = sampleArtwork();
    const hero = base.sprites[0];
    if (!hero) throw new Error('no sprite');
    const artwork = { ...base, coverSpriteId: hero.id, platformId: 'gb-dmg', platformStrict: true };
    const path = writeOlderFile(artwork);
    await openPath(held.kit, path);
    const legacy = workspaces()[0];
    if (!legacy) throw new Error('no workspace');
    held.disk.picks.folder = PARENT;
    expect(await runSplit(legacy.documentId, 'beside')).toEqual({ kind: 'done' });
    const manifest = savedProject(held.disk.files.get(`${PARENT}/Untitled/Untitled.bxproject`));
    expect(manifest.cover?.path.startsWith('sprites/')).toBe(true);
    expect(manifest.defaults.palette).toMatchObject({ kind: 'file' });
    expect(manifest.defaults).toMatchObject({ platformId: 'gb-dmg', platformStrict: true });
    const [project] = workspaces();
    const reopened = artworkOf(project?.documentId ?? ('' as DocumentId));
    expect(reopened.coverSpriteId).toBe(hero.id);
    expect(reopened.defaultBankId).toBe(artwork.defaultBankId);
    expect([reopened.platformId, reopened.platformStrict]).toEqual(['gb-dmg', true]);
  });
});

describe('a single asset outside a project', () => {
  it('opens as a loose workspace with the files it links', async () => {
    const artwork = sampleArtwork();
    const paths = writeProjectAssets(held.disk, PARENT, artwork);
    const sprite = artwork.sprites[0];
    if (!sprite) throw new Error('no sprite');
    await openPath(held.kit, paths.get(sprite.id) ?? '');
    const [workspace] = workspaces();
    expect(workspace?.kind).toBe('loose');
    const opened = artworkOf(workspace?.documentId ?? ('' as DocumentId));
    expect(opened.sprites.map((each) => each.id)).toEqual([sprite.id]);
    expect(opened.banks.map((bank) => bank.id)).toEqual([sprite.bankId]);
    expect(opened.sheets).toEqual([]);
    expect(workspace?.dirty.size).toBe(0);
  });
});
