/* @layer renderer-app @kind test */
import { COMMAND_NAME, flattenFrame } from '@bxel/document';
import type { BankId, DocumentId, Sprite } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import type { DocumentHost } from '../../src/documents/document-host.type';
import { changePreview } from '../../src/palette-change/change-preview';
import { framesText } from '../../src/palette-change/frames-text';
import type { ChangeRequest } from '../../src/palette-change/palette-change.type';
import { proposeChange } from '../../src/palette-change/propose-change';
import { runChange } from '../../src/palette-change/run-change';
import { useChangeStore } from '../../src/stores/useChangeStore';
import { runSteps } from '../../src/transactions/run-steps';
import { hostWithFile, revisionOf, sprites } from './dialog-harness';

const paint = (host: DocumentHost, documentId: DocumentId, name: string, index: number): void => {
  const bankId = host.view(documentId)?.state.artwork.defaultBankId;
  if (!bankId) throw new Error('missing bank');
  const created = runSteps(host, documentId, 'Add sprite', [
    { name: COMMAND_NAME.spriteCreate, targets: null, options: { name, width: 4, height: 4, bankId }, ref: 'extra' },
    {
      name: COMMAND_NAME.pixelsFill,
      targets: { sprites: [{ ref: 'extra' }], layers: { by: 'all' }, frames: { by: 'all' } },
      options: { x: 0, y: 0, index, mode: 'contiguous', connectivity: 4 },
    },
  ]);
  if (!created.ok) throw new Error(created.error.message);
};

const coloured = (sprite: Sprite | undefined, index: number): number => {
  const frame = sprite?.frames[0];
  if (!sprite || !frame) return -1;
  return [...flattenFrame(sprite, frame.id)].filter((value) => value === index).length;
};

const requestFor = (host: DocumentHost, documentId: DocumentId, patch: Partial<ChangeRequest>): ChangeRequest => {
  const bankId = host.view(documentId)?.state.artwork.defaultBankId as BankId;
  return { kind: 'delete', documentId, bankId, swatch: 8, other: 3, cap: 16, ...patch };
};

const previewOf = (host: DocumentHost, request: ChangeRequest) => {
  const view = host.view(request.documentId);
  const found = view ? changePreview(view, request) : null;
  if (!found) throw new Error('no preview');
  return found;
};

describe('the palette change preview', () => {
  it('lists the affected sprites with their frames and pixel counts', () => {
    const { host, documentId } = hostWithFile();
    paint(host, documentId, 'cap_red', 8);
    paint(host, documentId, 'cap_pink', 8);
    paint(host, documentId, 'cap_violet', 3);
    const preview = previewOf(host, requestFor(host, documentId, {}));
    expect(preview.affected.map((sprite) => [sprite.name, sprite.frames, sprite.pixels])).toEqual([
      ['cap_red', '1', 16],
      ['cap_pink', '1', 16],
    ]);
    expect(preview.totalSprites).toBe(4);
    expect(preview.pixels).toBe(32);
    expect(preview.error).toBeNull();
    expect(preview.swatchLine).toBe('Swatch 8 lilac, #A58CF0');
  });

  it('shows the same before and after as the committed change', () => {
    const { host, documentId } = hostWithFile();
    paint(host, documentId, 'cap_red', 8);
    const request = requestFor(host, documentId, {});
    const preview = previewOf(host, request);
    const first = preview.picture;
    expect(first?.before.data).not.toEqual(first?.after.data);
    expect(runChange(host, request, 'commit').ok).toBe(true);
    const sprite = sprites(host, documentId).find((each) => each.name === 'cap_red');
    expect(coloured(sprite, 3)).toBe(16);
  });

  it('is one undo step and a dry run changes nothing', () => {
    const { host, documentId } = hostWithFile();
    paint(host, documentId, 'cap_red', 8);
    const request = requestFor(host, documentId, {});
    const before = revisionOf(host, documentId);
    expect(runChange(host, request, 'preview').ok).toBe(true);
    expect(revisionOf(host, documentId)).toBe(before);
    expect(runChange(host, request, 'commit').ok).toBe(true);
    expect(revisionOf(host, documentId)).toBe(before + 1);
    const slots = host.view(documentId)?.state.artwork.banks[0]?.slots.length;
    expect(slots).toBe(15);
    expect(host.undo(documentId).ok).toBe(true);
    expect(host.view(documentId)?.state.artwork.banks[0]?.slots.length).toBe(16);
    expect(coloured(sprites(host, documentId).find((each) => each.name === 'cap_red'), 8)).toBe(16);
  });

});

describe('the rules of the palette change', () => {
  it('asks for a replacement when pixels use the swatch', () => {
    const { host, documentId } = hostWithFile();
    paint(host, documentId, 'cap_red', 8);
    expect(previewOf(host, requestFor(host, documentId, { other: null })).error).toBe('Choose a replacement swatch first.');
    expect(runChange(host, requestFor(host, documentId, { other: null }), 'commit').ok).toBe(false);
  });

  it('deletes an unused swatch with no replacement', () => {
    const { host, documentId } = hostWithFile();
    const preview = previewOf(host, requestFor(host, documentId, { other: null }));
    expect(preview.error).toBeNull();
    expect(preview.pixels).toBe(0);
    expect(runChange(host, requestFor(host, documentId, { other: null }), 'commit').ok).toBe(true);
  });

  it('merges one swatch into another', () => {
    const { host, documentId } = hostWithFile();
    paint(host, documentId, 'cap_red', 5);
    const request = requestFor(host, documentId, { kind: 'merge', swatch: 5, other: 2 });
    expect(previewOf(host, request).pixels).toBe(16);
    expect(runChange(host, request, 'commit').ok).toBe(true);
    expect(coloured(sprites(host, documentId).find((each) => each.name === 'cap_red'), 2)).toBe(16);
  });

  it('refuses a limit below the colours in use and accepts a raise', () => {
    const { host, documentId } = hostWithFile();
    const low = previewOf(host, requestFor(host, documentId, { kind: 'limit', cap: 8 }));
    expect(low.error).toBe('The new limit is below the 16 colours in use. Merge or delete swatches first.');
    const raised = requestFor(host, documentId, { kind: 'limit', cap: 32 });
    const preview = previewOf(host, raised);
    expect(preview.error).toBeNull();
    expect([preview.countBefore, preview.countAfter]).toEqual(['15 opaque + transparent = 16', '31 opaque + transparent = 32']);
    expect(runChange(host, raised, 'commit').ok).toBe(true);
    expect(host.view(documentId)?.state.artwork.banks[0]?.cap).toBe(32);
  });
});

describe('proposing a change', () => {
  it('keeps slot 0 where it is', () => {
    const { host, documentId } = hostWithFile();
    const view = host.view(documentId);
    expect(proposeChange('delete', view, { foreground: 0, background: 1 })).toEqual({
      ok: false,
      message: 'Slot 0 stays where it is. Choose another swatch.',
    });
  });

  it('proposes the foreground swatch and merges into the background swatch', () => {
    const { host, documentId } = hostWithFile();
    const view = host.view(documentId);
    const merged = proposeChange('merge', view, { foreground: 4, background: 6 });
    expect(merged.ok && [merged.request.swatch, merged.request.other]).toEqual([4, 6]);
  });

  it('asks for a file first', () => {
    expect(proposeChange('limit', null, { foreground: 1, background: 0 })).toEqual({ ok: false, message: 'Open or create a file first.' });
  });

  it('cancel clears the proposal and changes nothing', () => {
    const { host, documentId } = hostWithFile();
    const before = revisionOf(host, documentId);
    useChangeStore.getState().propose(requestFor(host, documentId, {}));
    useChangeStore.getState().setOther(5);
    expect(useChangeStore.getState().request?.other).toBe(5);
    useChangeStore.getState().hide();
    expect(useChangeStore.getState().request).toBeNull();
    expect(revisionOf(host, documentId)).toBe(before);
  });
});

describe('frame ranges', () => {
  it('joins runs of frames', () => {
    expect(framesText([1])).toBe('1');
    expect(framesText([1, 2, 3, 4])).toBe('1 to 4');
    expect(framesText([1, 2, 4, 6, 7])).toBe('1 to 2, 4, 6 to 7');
  });
});
