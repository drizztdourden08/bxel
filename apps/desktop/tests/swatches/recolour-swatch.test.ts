/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { recolourSwatch } from '../../src/palette-bank/recolour-swatch';
import { openEditor } from '../editor/editor-harness';

describe('changing the colour of a swatch from the palette', () => {
  it('writes the new colour into the bank as one command', () => {
    const { host, documentId, target } = openEditor();
    const before = host.view(documentId)?.state.revision ?? 0;
    const outcome = recolourSwatch(host, documentId, target().bank, { index: 5, rgb: '#010203' });
    expect(outcome.ok).toBe(true);
    const slot = target().bank.slots[5];
    expect(slot?.kind === 'color' ? slot.rgb : null).toBe('#010203');
    expect(host.view(documentId)?.state.revision).toBe(before + 1);
  });

  it('does nothing when the colour is the same', () => {
    const { host, documentId, target } = openEditor();
    const slot = target().bank.slots[5];
    const before = host.view(documentId)?.state.revision ?? 0;
    const outcome = recolourSwatch(host, documentId, target().bank, { index: 5, rgb: slot?.kind === 'color' ? slot.rgb.toUpperCase() : '' });
    expect(outcome).toEqual({ ok: true, message: 'The colour did not change.' });
    expect(host.view(documentId)?.state.revision).toBe(before);
  });

  it('refuses the transparent swatch', () => {
    const { host, documentId, target } = openEditor();
    expect(recolourSwatch(host, documentId, target().bank, { index: 0, rgb: '#010203' })).toEqual({ ok: false, message: 'The transparent swatch cannot be edited.' });
  });
});
