/* @layer renderer-app @kind test */
import type { Artwork, DocumentId } from '@bxel/document';
import { splitIntoAssets } from '@bxel/document';
import { createFolderId } from '@bxel/project';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { encodeAsset } from '../../src/workspace/encode-asset';
import { sampleArtwork } from '../workspace/workspace-harness';
import { key } from './disk-paths';
import type { Disk } from './memory-disk';
import { manifestOf, ROOT } from './project-harness';
import { fieldOf, grantOf, rowsOf, toolRig } from './project-tool-rig';
import type { ToolRig } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

const SHARED = 'C:/Art/Shared';
const clock = (): number => 1_700_000_000_000;

let current: ToolRig;
let artwork: Artwork;

const hiddenSprite = () => {
  const found = artwork.sprites[0];
  if (!found) throw new Error('no sprite');
  return found;
};

const visibleSprite = () => {
  const found = artwork.sprites[1];
  if (!found) throw new Error('no second sprite');
  return found;
};

const seed = (disk: Disk): void => {
  const plan = splitIntoAssets(artwork);
  const paths = new Map<string, string>(plan.files.map((file) => [file.key.id, `${ROOT}/${file.path}`] as const));
  paths.set(hiddenSprite().id, `${SHARED}/hidden.bxsprite`);
  for (const file of plan.files) {
    const path = paths.get(file.key.id) ?? '';
    disk.dirs.add(path.slice(0, path.lastIndexOf('/')));
    disk.files.set(path, encodeAsset(artwork, file.key, paths, { preview: null, clock }));
  }
  disk.dirs.add(SHARED);
  disk.granted.add(key(SHARED));
};

const documentId = (): DocumentId => {
  const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
  if (!workspace) throw new Error('the project workspace did not open');
  return workspace.documentId;
};

const scopeOf = (spriteId: string) => ({ sprites: [spriteId], layers: { by: 'all' }, frames: { by: 'all' } });

const layerStep = (spriteId: string) => ({ name: 'layer.add', targets: scopeOf(spriteId), options: { name: 'Ink' } });

const editInput = (spriteId: string) => ({
  documentId: documentId(),
  baseRevision: current.rig.kit.host.view(documentId())?.state.revision ?? 1,
  label: 'Ink',
  steps: [layerStep(spriteId)],
});

const pixelsInput = (spriteId: string) => ({ documentId: documentId(), spriteId, layer: 'flattened', rect: { x: 0, y: 0, width: 2, height: 2 } });

beforeEach(async () => {
  artwork = sampleArtwork();
  const owner = manifestOf();
  const rootFolder = owner.folders[0];
  if (!rootFolder) throw new Error('no root folder');
  const shared = { folderId: createFolderId((length) => Uint8Array.from({ length }, (_unused, index) => index + 9)), name: 'Shared', path: '../Shared' };
  const manifest = { ...owner, folders: [rootFolder, { ...rootFolder, ...shared, roles: {} }], assistant: { ...owner.assistant, folders: [rootFolder.folderId] } };
  current = await toolRig({ manifest, seed });
});

describe('a sprite in a folder the assistant may not see', () => {
  it('opens in the workspace for the owner, so the guard has something to hide', () => {
    const view = current.rig.kit.host.view(documentId());
    expect(view?.state.artwork.sprites.map((sprite) => sprite.id)).toContain(hiddenSprite().id);
  });

  it('is left out of get_document and list_documents', async () => {
    const doc = await current.run('get_document', { documentId: documentId(), spriteOffset: 0, spriteLimit: 50 }, current.grants('edit'));
    expect(rowsOf(doc, 'sprites').map((sprite) => sprite.spriteId)).toEqual([visibleSprite().id]);
    expect(fieldOf(doc, 'spritesTotal')).toBe(1);
    const listed = await current.run('list_documents', {}, current.grants('edit'));
    expect(rowsOf(listed, 'documents')[0]?.sprites).toBe(1);
  });

  it('cannot be read with read_pixels, render_preview or export_document', async () => {
    const pixels = await current.run('read_pixels', pixelsInput(hiddenSprite().id), current.grants('edit'));
    expect(pixels).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
    const preview = await current.run('render_preview', { documentId: documentId(), target: { spriteId: hiddenSprite().id }, scale: 2 }, current.grants('edit'));
    expect(preview).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
    const exported = await current.run('export_document', { documentId: documentId(), format: 'png', source: { spriteId: hiddenSprite().id }, fileName: 'x.png', scale: 1 }, current.grants('edit'));
    expect(exported).toMatchObject({ ok: false });
    const seen = await current.run('read_pixels', pixelsInput(visibleSprite().id), current.grants('edit'));
    expect(seen).toMatchObject({ ok: true });
  });

  it('cannot be edited with apply_edits or preview_edits, and the visible sprite still can', async () => {
    const before = current.rig.kit.host.view(documentId())?.state.revision;
    const refused = await current.run('apply_edits', editInput(hiddenSprite().id), current.grants('edit'));
    expect(refused).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
    const previewed = await current.run('preview_edits', editInput(hiddenSprite().id), current.grants('edit'));
    expect(previewed).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
    expect(current.rig.kit.host.view(documentId())?.state.revision).toBe(before);
    const allowed = await current.run('apply_edits', editInput(visibleSprite().id), current.grants('edit'));
    expect(allowed).toMatchObject({ ok: true });
  });

  it('cannot be edited through a step that touches it without naming it', async () => {
    const bank = artwork.banks[0];
    const slot = bank?.slots.find((each) => each.kind !== 'transparent');
    const before = current.rig.kit.host.view(documentId())?.state.revision ?? 1;
    const options = { bankId: bank?.id, swatchId: slot?.id, rgb: '#123456' };
    const steps = [{ name: 'swatch.update', targets: null, options }];
    const outcome = await current.run('apply_edits', { documentId: documentId(), baseRevision: before, label: 'Recolour', steps }, current.grants('edit'));
    expect(outcome).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
    expect(current.rig.kit.host.view(documentId())?.state.revision).toBe(before);
  });

  it('cannot be saved by name or copied out with save_document', async () => {
    const saved = await current.run('save_document', { documentId: documentId(), asset: { kind: 'sprite', id: hiddenSprite().id }, target: 'current' }, current.grants('edit'));
    expect(saved).toMatchObject({ ok: false, error: { code: 'DOCUMENT_NOT_FOUND' } });
  });
});

describe('a project whose every folder is hidden', () => {
  beforeEach(async () => {
    const owner = manifestOf();
    current = await toolRig({ manifest: { ...owner, assistant: { ...owner.assistant, folders: [] } }, seed });
  });

  it('shows the assistant no document at all', async () => {
    const listed = await current.run('list_documents', {}, [grantOf(current.projectId, 'edit')]);
    expect(rowsOf(listed, 'documents')).toEqual([]);
    const doc = await current.run('get_document', { documentId: documentId(), spriteOffset: 0, spriteLimit: 50 }, current.grants('edit'));
    expect(doc).toMatchObject({ ok: false, error: { code: 'DOCUMENT_NOT_FOUND' } });
    const palette = await current.run('read_palette', { documentId: documentId() }, current.grants('edit'));
    expect(palette).toMatchObject({ ok: false, error: { code: 'DOCUMENT_NOT_FOUND' } });
  });
});
