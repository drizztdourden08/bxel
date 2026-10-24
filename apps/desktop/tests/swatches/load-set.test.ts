/* @layer renderer-app @kind test */
import { findBank } from '@bxel/document';
import type { DocumentId, PaletteBank } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import type { DocumentHost } from '../../src/documents/document-host.type';
import { createNewFile } from '../../src/new-sprite/create-new-file';
import { initialForm } from '../../src/new-sprite/initial-form';
import { NEW_MEMORY_DEFAULT } from '../../src/new-sprite/new-sprite.constants';
import { patchForm } from '../../src/new-sprite/patch-form';
import type { SourceColor } from '../../src/palette-source/palette-source.type';
import { loadMessage } from '../../src/swatch-library/load-message';
import { loadPlan } from '../../src/swatch-library/load-plan';
import { runLoad } from '../../src/swatch-library/run-load';
import type { LibrarySet } from '../../src/swatch-library/swatch-library.type';
import { hostWithFile, newHost } from '../dialogs/dialog-harness';

interface Open {
  host: DocumentHost;
  documentId: DocumentId;
}

const colors = (...values: string[]): SourceColor[] => values.map((rgb) => ({ rgb, name: rgb }));

const setOf = (...values: string[]): LibrarySet => ({ key: 'user:x', origin: 'user', name: 'X', colors: colors(...values), setId: null });

const roomy = (): Open => {
  const host = newHost();
  const form = patchForm(initialForm(NEW_MEMORY_DEFAULT, []), { name: 'a', limit: 32 });
  const outcome = createNewFile(host, form);
  if (!outcome.ok) throw new Error(outcome.message);
  return { host, documentId: outcome.documentId };
};

const bankOf = ({ host, documentId }: Open): PaletteBank => {
  const artwork = host.view(documentId)?.state.artwork;
  const bank = artwork ? findBank(artwork, artwork.defaultBankId) : undefined;
  if (!bank) throw new Error('no bank');
  return bank;
};

const rgbs = (bank: PaletteBank): string[] => bank.slots.flatMap((slot) => (slot.kind === 'color' ? [slot.rgb] : []));

const hex = (index: number): string => `#00${(index + 16).toString(16).padStart(2, '0')}00`;

describe('the load plan', () => {
  it('appends only colours the palette does not hold yet, in order', () => {
    const bank = bankOf(roomy());
    const plan = loadPlan(bank, colors(rgbs(bank)[0] ?? '#000000', '#010203', '#010203', '#040506'), 'append');
    expect(plan.colors).toEqual(['#010203', '#040506']);
    expect(plan.skipped).toBe(1);
  });

  it('cuts the colours at the free slots and counts what did not fit', () => {
    const bank = bankOf(roomy());
    const free = bank.cap - bank.slots.length;
    const plan = loadPlan(bank, colors(...Array.from({ length: free + 3 }, (_unused, index) => hex(index))), 'append');
    expect(plan.colors).toHaveLength(free);
    expect(plan.dropped).toBe(3);
  });

  it('replaces up to the slots after the transparent one', () => {
    const bank = bankOf(roomy());
    const room = bank.cap - (bank.transparent ? 1 : 0);
    const plan = loadPlan(bank, colors(...Array.from({ length: room + 2 }, (_unused, index) => hex(index))), 'replace');
    expect(plan.colors).toHaveLength(room);
    expect(plan.dropped).toBe(2);
    expect(plan.mode).toBe('replace');
  });

  it('says what happened in plain words', () => {
    expect(loadMessage({ mode: 'append', colors: ['#000000'], dropped: 0, skipped: 0 }, 16)).toBe('Added 1 colour.');
    expect(loadMessage({ mode: 'append', colors: ['#000000', '#111111'], dropped: 2, skipped: 1 }, 16)).toBe(
      'Added 2 colours. 2 colours did not fit the limit of 16. 1 colour was already in the palette.',
    );
    expect(loadMessage({ mode: 'replace', colors: ['#000000'], dropped: 1, skipped: 0 }, 4)).toBe('Replaced the palette with 1 colour. 1 colour did not fit the limit of 4.');
  });
});

describe('loading a set into the open palette', () => {
  it('appends the colours as one undo step', () => {
    const open = roomy();
    const bank = bankOf(open);
    const outcome = runLoad(open.host, { documentId: open.documentId, bankId: bank.id, set: setOf('#0a0b0c', '#0d0e0f'), mode: 'append' });
    expect(outcome).toEqual({ ok: true, message: 'Added 2 colours.' });
    expect(bankOf(open).slots).toHaveLength(bank.slots.length + 2);
    expect(open.host.undo(open.documentId).ok).toBe(true);
    expect(bankOf(open).slots).toHaveLength(bank.slots.length);
  });

  it('holds back what exceeds the limit instead of failing', () => {
    const open = roomy();
    const bank = bankOf(open);
    const free = bank.cap - bank.slots.length;
    const many = Array.from({ length: free + 2 }, (_unused, index) => hex(index));
    const outcome = runLoad(open.host, { documentId: open.documentId, bankId: bank.id, set: setOf(...many), mode: 'append' });
    expect(outcome.ok).toBe(true);
    expect(bankOf(open).slots).toHaveLength(bank.cap);
    expect(outcome.message).toContain('2 colours did not fit the limit');
  });

  it('replaces the colours of the palette', () => {
    const open = roomy();
    const outcome = runLoad(open.host, { documentId: open.documentId, bankId: bankOf(open).id, set: setOf('#0a0b0c', '#0d0e0f'), mode: 'replace' });
    expect(outcome.ok).toBe(true);
    expect(rgbs(bankOf(open))).toEqual(['#0a0b0c', '#0d0e0f']);
  });

  it('reports a set whose colours are all in the palette already', () => {
    const open = roomy();
    const first = rgbs(bankOf(open))[0] ?? '#000000';
    const outcome = runLoad(open.host, { documentId: open.documentId, bankId: bankOf(open).id, set: setOf(first), mode: 'append' });
    expect(outcome).toEqual({ ok: false, message: 'Every colour of that set is already in the palette.' });
  });

  it('says so when the palette has no free slot', () => {
    const { host, documentId } = hostWithFile();
    const bank = bankOf({ host, documentId });
    const outcome = runLoad(host, { documentId, bankId: bank.id, set: setOf('#0a0b0c'), mode: 'append' });
    expect(outcome.ok).toBe(false);
    expect(outcome.message).toBe(`The palette is full at ${bank.cap} slots. Raise the limit or replace colours.`);
  });
});
