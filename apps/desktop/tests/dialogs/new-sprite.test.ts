/* @layer renderer-app @kind test */
import { flattenFrame } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { PALETTE_TEXT } from '../../src/editor/palette-text.constants';
import { createAsset } from '../../src/new-sprite/create-asset';
import { createNewFile } from '../../src/new-sprite/create-new-file';
import { createSpriteInFile } from '../../src/new-sprite/create-sprite-in-file';
import { hasErrors } from '../../src/new-sprite/has-errors';
import { initialForm } from '../../src/new-sprite/initial-form';
import { newFormErrors } from '../../src/new-sprite/new-form-errors';
import { NEW_MEMORY_DEFAULT } from '../../src/new-sprite/new-sprite.constants';
import type { CreationForm } from '../../src/new-sprite/new-sprite.type';
import { newSummary } from '../../src/new-sprite/new-summary';
import { patchForm } from '../../src/new-sprite/patch-form';
import { limitError } from '../../src/palette-limit/limit-error';
import { LIMIT_DEFAULT, LIMIT_PRESETS } from '../../src/palette-limit/palette-limit.constants';
import { usageLine } from '../../src/palette-limit/usage-line';
import { useCreateDialogStore } from '../../src/stores/useCreateDialogStore';
import { hostWithFile, newHost, revisionOf, sprites } from './dialog-harness';

const blank = (): CreationForm => initialForm(NEW_MEMORY_DEFAULT, []);

describe('the count line and the limit rules', () => {
  it('states the opaque colours, the transparent slot and the limit in the wording of the contract', () => {
    expect(PALETTE_TEXT.count(16, true)).toBe('15 opaque + transparent = 16');
    expect(PALETTE_TEXT.count(16, false)).toBe('16 opaque, no transparency = 16');
    expect(newSummary(blank()).count).toBe('15 opaque + transparent = 16');
    expect(newSummary(patchForm(blank(), { transparent: false, limit: 8 })).count).toBe('8 opaque, no transparency = 8');
  });

  it('counts the used colours and says when the palette is full', () => {
    expect(usageLine(11, 15)).toBe('11 of 15 opaque used');
    expect(usageLine(15, 15)).toBe('15 of 15 opaque used. Palette is full.');
    expect(newSummary(blank()).usage).toBe('0 of 15 opaque used');
  });

  it('defaults to 16, offers the presets and accepts 1 to 256 only', () => {
    expect(LIMIT_DEFAULT).toBe(16);
    expect(NEW_MEMORY_DEFAULT.limit).toBe(16);
    expect(LIMIT_PRESETS).toEqual([4, 8, 16, 32, 64, 256]);
    expect([1, 16, 256].map(limitError)).toEqual([null, null, null]);
    expect([0, 257, 2.5, Number.NaN].every((value) => limitError(value) === 'The colour limit must be between 1 and 256.')).toBe(true);
  });

  it('says plainly when a palette has more colours than the limit holds', () => {
    const summary = newSummary(patchForm(blank(), { limit: 4 }));
    expect(summary.count).toBe('3 opaque + transparent = 4');
    expect(summary.fits).toBe('Uses the first 3 of 15 colours. Raise the limit to keep all of them.');
  });
});

describe('the form errors', () => {
  it('is valid at the start', () => {
    expect(hasErrors(newFormErrors(blank(), []))).toBe(false);
  });

  it('names the field that is wrong', () => {
    const errors = newFormErrors(patchForm(blank(), { name: ' ', width: 0, limit: 300 }), []);
    expect(errors.name).toBe('A name has 1 to 64 characters you can print.');
    expect(errors.size).toBe('Size must be between 1 and 2048 pixels.');
    expect(errors.limit).toBe('The colour limit must be between 1 and 256.');
  });

  it('refuses a name that the file already uses', () => {
    expect(newFormErrors(blank(), ['Sprite']).name).toBe('Name sprite is already used. Choose another name.');
  });

  it('limits a sheet to 64 sprites', () => {
    const errors = newFormErrors(patchForm(blank(), { kind: 'sheet', columns: 9, rows: 9 }), []);
    expect(errors.sheet).toBe('A sheet holds 1 to 64 sprites.');
  });
});

describe('creating a new file', () => {
  it('creates one sprite with the chosen size, name, limit and transparent slot', () => {
    const host = newHost();
    const outcome = createNewFile(host, patchForm(blank(), { name: 'mushroom', width: 24, height: 12, limit: 32 }));
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    const [sprite] = sprites(host, outcome.documentId);
    const bank = host.view(outcome.documentId)?.state.artwork.banks[0];
    expect([sprite?.name, sprite?.width, sprite?.height]).toEqual(['mushroom', 24, 12]);
    expect([bank?.cap, bank?.transparent, bank?.slots.length]).toEqual([32, true, 16]);
    expect(bank?.name).toBe('Bxel 16');
  });

  it('makes the first slot the background colour when transparency is off', () => {
    const host = newHost();
    const outcome = createNewFile(host, patchForm(blank(), { transparent: false, limit: 16 }));
    expect(outcome.ok).toBe(true);
    const bank = outcome.ok ? host.view(outcome.documentId)?.state.artwork.banks[0] : undefined;
    expect([bank?.transparent, bank?.slots.length, bank?.slots[0]?.kind]).toEqual([false, 15, 'color']);
  });

  it('fills an opaque background and keeps the fill in one undo step', () => {
    const host = newHost();
    const form = patchForm(blank(), { background: 'opaque', backgroundSlot: 3, width: 4, height: 4 });
    const outcome = createNewFile(host, form);
    expect(outcome.ok).toBe(true);
    if (!outcome.ok) return;
    const { documentId } = outcome;
    const sprite = sprites(host, documentId)[0];
    const frame = sprite?.frames[0];
    expect(sprite && frame ? [...flattenFrame(sprite, frame.id)].every((value) => value === 3) : false).toBe(true);
    const before = revisionOf(host, documentId);
    expect(host.undo(documentId).ok).toBe(true);
    expect(revisionOf(host, documentId)).toBe(before + 1);
    const cleared = sprites(host, documentId)[0];
    expect(cleared && frame ? [...flattenFrame(cleared, frame.id)].every((value) => value === 0) : false).toBe(true);
  });

  it('creates a sheet as sprites named in order, in one undo step', () => {
    const host = newHost();
    const form = patchForm(blank(), { kind: 'sheet', name: 'cap', columns: 3, rows: 2, cellWidth: 8, cellHeight: 8 });
    const outcome = createNewFile(host, form);
    expect(outcome.ok && outcome.names).toEqual(['cap_01', 'cap_02', 'cap_03', 'cap_04', 'cap_05', 'cap_06']);
    if (!outcome.ok) return;
    expect(sprites(host, outcome.documentId).map((sprite) => sprite.name)).toHaveLength(6);
    expect(host.undo(outcome.documentId).ok).toBe(true);
    expect(sprites(host, outcome.documentId).map((sprite) => sprite.name)).toEqual(['cap_01']);
  });

  it('opens no file when the form is refused', () => {
    const host = newHost();
    const outcome = createNewFile(host, patchForm(blank(), { width: 0 }));
    expect(outcome.ok).toBe(false);
    expect(host.list()).toHaveLength(0);
  });

  it('creates nothing when the dialog is cancelled', () => {
    const host = newHost();
    useCreateDialogStore.getState().show('file');
    useCreateDialogStore.getState().hide();
    expect(useCreateDialogStore.getState().mode).toBe('closed');
    expect(host.list()).toHaveLength(0);
  });
});

describe('naming a new sheet', () => {
  it('names the new sheet Sheet 1 in a new file', () => {
    const host = newHost();
    const outcome = createNewFile(host, patchForm(blank(), { kind: 'sheet', name: 'cap', columns: 2, rows: 1, cellWidth: 8, cellHeight: 8 }));
    expect(outcome.ok).toBe(true);
    const sheets = outcome.ok ? host.view(outcome.documentId)?.state.artwork.sheets.map((sheet) => sheet.name) : [];
    expect(sheets).toEqual(['Sheet 1']);
  });

  it('numbers the sheets Sheet 1, Sheet 2 and so on', () => {
    const { host, documentId } = hostWithFile();
    const form = patchForm(blank(), { kind: 'sheet', name: 'cap', columns: 2, rows: 1, cellWidth: 8, cellHeight: 8 });
    expect(createAsset(host, documentId, form).ok).toBe(true);
    expect(createAsset(host, documentId, { ...form, name: 'hat' }).ok).toBe(true);
    expect(host.view(documentId)?.state.artwork.sheets.map((sheet) => sheet.name)).toEqual(['Sheet 1', 'Sheet 2']);
  });
});

describe('creating a sprite in an open file', () => {
  it('inherits the file palette and is one undo step', () => {
    const { host, documentId } = hostWithFile();
    const artwork = host.view(documentId)?.state.artwork;
    const outcome = createSpriteInFile(host, documentId, { name: 'toadstool', width: 16, height: 16 });
    expect(outcome.ok).toBe(true);
    const added = sprites(host, documentId).find((sprite) => sprite.name === 'toadstool');
    expect(added?.bankId).toBe(artwork?.defaultBankId);
    expect(host.view(documentId)?.state.artwork.banks).toHaveLength(1);
    expect(host.undo(documentId).ok).toBe(true);
    expect(sprites(host, documentId).map((sprite) => sprite.name)).toEqual(['sprite']);
  });

  it('reports a name that is already used and changes nothing', () => {
    const { host, documentId } = hostWithFile();
    const before = revisionOf(host, documentId);
    const outcome = createSpriteInFile(host, documentId, { name: 'sprite', width: 8, height: 8 });
    expect(outcome.ok).toBe(false);
    expect(revisionOf(host, documentId)).toBe(before);
  });
});
