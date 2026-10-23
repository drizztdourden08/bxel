/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { celBytes, currentBank, currentSprite, execute, makeRig, slotId, step, succeed } from './palette-engine';

describe('swatch.update', () => {
  it('recolours a swatch without touching a pixel', () => {
    const rig = makeRig();
    const cels = Object.values(currentSprite(rig).cels).map((cel) => cel.pixels);
    const bytes = celBytes(currentSprite(rig));
    const result = succeed(execute(rig, [step('swatch.update', { bankId: rig.bankId, swatchId: slotId(rig, 2), rgb: '#FF7A8A' })]));
    const slot = currentBank(rig).slots[2];
    expect(slot?.kind === 'color' ? slot.rgb : null).toBe('#ff7a8a');
    expect(celBytes(currentSprite(rig))).toEqual(bytes);
    expect(Object.values(currentSprite(rig).cels).every((cel, index) => cel.pixels === cels[index])).toBe(true);
    expect(result.ok && result.changes.sprites.map((sprite) => [sprite.recolored, sprite.cels.length])).toEqual([[true, 0]]);
  });

  it('renames a swatch and undoes the change', () => {
    const rig = makeRig();
    succeed(execute(rig, [step('swatch.update', { bankId: rig.bankId, swatchId: slotId(rig, 1), name: 'Ink' })]));
    const renamed = currentBank(rig).slots[1];
    expect(renamed?.kind === 'color' ? renamed.name : null).toBe('Ink');
    rig.engine.undo({ documentId: rig.engine.documentId, expectedRevision: rig.engine.state().revision });
    const restored = currentBank(rig).slots[1];
    expect(restored?.kind === 'color' ? restored.name : null).toBe('Night');
  });

  it('recolours the Background slot of an opaque bank', () => {
    const rig = makeRig({ transparent: false });
    succeed(execute(rig, [step('swatch.update', { bankId: rig.bankId, swatchId: slotId(rig, 0), rgb: '#000000' })]));
    const slot = currentBank(rig).slots[0];
    expect(slot?.kind === 'color' ? slot.rgb : null).toBe('#000000');
  });
});

describe('swatch.add', () => {
  it('appends a swatch at the next index and lowercases the colour', () => {
    const rig = makeRig();
    const result = succeed(execute(rig, [{ ...step('swatch.add', { bankId: rig.bankId, rgb: '#FF7A8A', name: 'Coral' }), ref: 'coral' }]));
    const bank = currentBank(rig);
    expect(bank.slots).toHaveLength(6);
    const added = bank.slots[5];
    expect(added?.kind === 'color' ? [added.rgb, added.name] : null).toEqual(['#ff7a8a', 'Coral']);
    expect(result.ok && result.created.coral).toBe(added?.id);
    expect(result.ok && result.warnings).toEqual([]);
  });

  it('names the swatch after its colour when no name is given', () => {
    const rig = makeRig();
    succeed(execute(rig, [step('swatch.add', { bankId: rig.bankId, rgb: '#112233' })]));
    const added = currentBank(rig).slots[5];
    expect(added?.kind === 'color' ? added.name : null).toBe('#112233');
  });

  it('warns about a duplicate colour and still adds it', () => {
    const rig = makeRig();
    const result = succeed(execute(rig, [step('swatch.add', { bankId: rig.bankId, rgb: '#4B1FA0' })]));
    expect(currentBank(rig).slots).toHaveLength(6);
    expect(result.ok && result.warnings.map((warning) => [warning.code, warning.step])).toEqual([['DUPLICATE_COLOR', 0]]);
  });

  it('fills a bank to its cap and no further', () => {
    const rig = makeRig({ cap: 6 });
    succeed(execute(rig, [step('swatch.add', { bankId: rig.bankId, rgb: '#112233' })]));
    const full = execute(rig, [step('swatch.add', { bankId: rig.bankId, rgb: '#445566' })]);
    expect(full.ok ? null : full.error.code).toBe('PALETTE_FULL');
    expect(currentBank(rig).slots).toHaveLength(6);
  });
});
