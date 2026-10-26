/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, AssetKey, DocumentId, Sprite } from '@bxel/document';
import { describe, expect, it, vi } from 'vitest';
import type { AssetFocus } from '../../src/asset-config/asset-config.type';
import { duplicateFocused } from '../../src/asset-overview/duplicate-focused';
import { factsOf } from '../../src/asset-overview/facts-of';
import { linksOf } from '../../src/asset-overview/links-of';
import { moveFocused } from '../../src/asset-overview/move-focused';
import { previewOf } from '../../src/asset-overview/preview-of';
import { renameFocused } from '../../src/asset-overview/rename-focused';
import { resizeFocused } from '../../src/asset-overview/resize-focused';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';
import { toast } from '../project/project-mocks';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const NO_FILE = { path: null, size: null, modified: null };

type Rig = { readonly documentId: DocumentId; readonly focus: (key: AssetKey) => AssetFocus };

const rig = (): Rig => {
  const { host, setActive } = useDocumentStore.getState();
  const documentId = createDefaultArtwork(host);
  setActive(documentId);
  const made = runSteps(host, documentId, 'Make', [
    { name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'slime', width: 8, height: 6 } },
    { name: COMMAND_NAME.sheetCreate, targets: null, options: { name: 'walk' } },
  ]);
  if (!made.ok) throw new Error(made.error.message);
  const focus = (key: AssetKey): AssetFocus => {
    const artwork: Artwork | undefined = host.view(documentId)?.state.artwork;
    if (!artwork) throw new Error('no artwork');
    return { documentId, key, artwork, readOnly: false };
  };
  return { documentId, focus };
};

const slimeOf = (held: Rig): Sprite => {
  const sprite = held.focus({ kind: 'palette', id: '' }).artwork.sprites.find((each) => each.name === 'slime' || each.name === 'hero');
  if (!sprite) throw new Error('no sprite');
  return sprite;
};

const spriteKey = (held: Rig): AssetKey => ({ kind: 'sprite', id: slimeOf(held).id });

describe('the overview of an asset', () => {
  it('previews a sprite as one image and counts the colours it uses', () => {
    const held = rig();
    const key = spriteKey(held);
    const focus = held.focus(key);
    const preview = previewOf(focus.artwork, key);
    expect(preview.kind).toBe('image');
    const labels = factsOf(focus, preview, NO_FILE).map((fact) => fact.label);
    expect(labels).toEqual(expect.arrayContaining(['Kind', 'Size', 'Layers', 'Colours', 'Created', 'File size', 'File']));
  });

  it('previews a palette as its swatches', () => {
    const held = rig();
    const bank = held.focus({ kind: 'palette', id: '' }).artwork.banks[0];
    if (!bank) throw new Error('no palette');
    const preview = previewOf(held.focus({ kind: 'palette', id: bank.id }).artwork, { kind: 'palette', id: bank.id });
    expect(preview.kind).toBe('swatches');
    if (preview.kind === 'swatches') expect(preview.colours.length).toBe(bank.slots.length);
  });

  it('says a sheet without sprites has nothing to preview', () => {
    const held = rig();
    const sheet = held.focus({ kind: 'palette', id: '' }).artwork.sheets[0];
    if (!sheet) throw new Error('no sheet');
    expect(previewOf(held.focus({ kind: 'sheet', id: sheet.id }).artwork, { kind: 'sheet', id: sheet.id }).kind).toBe('none');
  });

  it('links a sprite to its palette', () => {
    const held = rig();
    const key = spriteKey(held);
    const links = linksOf(held.focus(key).artwork, key);
    expect(links.map((link) => `${link.relation}:${link.kindLabel}`)).toContain('uses:Palette');
  });
});

describe('the actions of the overview', () => {
  it('renames the asset, and refuses an empty name', () => {
    const held = rig();
    const key = spriteKey(held);
    expect(renameFocused(held.focus(key), '  hero  ')).toBeNull();
    expect(slimeOf(held).name).toBe('hero');
    expect(renameFocused(held.focus(key), '   ')).toBe('Type a name.');
  });

  it('duplicates the asset', () => {
    const held = rig();
    const key = spriteKey(held);
    const before = held.focus(key).artwork.sprites.length;
    duplicateFocused(held.focus(key));
    expect(held.focus(key).artwork.sprites).toHaveLength(before + 1);
    expect(toast).toHaveBeenCalled();
  });

  it('resizes a sprite in one step', () => {
    const held = rig();
    const key = spriteKey(held);
    resizeFocused(held.focus(key), 12, 10);
    const sprite = slimeOf(held);
    expect([sprite.width, sprite.height]).toEqual([12, 10]);
  });

  it('flips and turns a sprite', () => {
    const held = rig();
    const key = spriteKey(held);
    moveFocused(held.focus(key), { id: 'turn', label: 'Turn', icon: 'rotate-ccw', turn: 'clockwise' });
    const sprite = slimeOf(held);
    expect([sprite.width, sprite.height]).toEqual([6, 8]);
  });
});
