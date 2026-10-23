/* @layer core @kind test */
import { counterIdSource, flattenFrame, frameToRgba, projectCreate } from '@bxel/document';
import type { BankId, FrameId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { brand, fixtureToProject } from './fixture-to-project';
import { heartEngine, request } from './heart-engine';
import { heartPairFixture } from './heart-pair-fixture';
import { snapshotProject } from './snapshot-project';

describe('engine round trip', () => {
  it('holds every field and every cel byte of the fixture', () => {
    const { engine } = heartEngine();
    const expected = fixtureToProject(heartPairFixture);
    expect(snapshotProject(engine.state().project)).toBe(snapshotProject(expected));
    expect(engine.state().revision).toBe(1);
  });

  it('treats an empty commit as a no-op that keeps the revision', () => {
    const { engine } = heartEngine();
    const result = engine.execute(request([]));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.noop).toBe(true);
    expect(engine.state().revision).toBe(1);
    expect(engine.canUndo()).toBe(false);
  });

  it('flattens heart frame 1 to the fixture rows', () => {
    const { engine } = heartEngine();
    const sprite = engine.state().project.sprites.find((item) => item.name === 'heart');
    expect(sprite).toBeDefined();
    if (!sprite) return;
    const flat = flattenFrame(sprite, brand<FrameId>('frm_000012'));
    expect(Array.from(flat, (value) => value.toString(16)).join('')).toBe(
      ['01100110', '16311331', '13333341', '13333341', '01333410', '00134100', '00011000', '00000000'].join(''),
    );
  });

  it('maps indices to rgba with a transparent slot 0', () => {
    const { engine } = heartEngine();
    const project = engine.state().project;
    const sprite = project.sprites.find((item) => item.name === 'heart');
    const bank = project.banks.find((item) => item.id === brand<BankId>('bnk_000002'));
    if (!sprite || !bank) throw new Error('fixture is missing the heart sprite or its bank');
    const rgba = frameToRgba(sprite, bank, brand<FrameId>('frm_000012'));
    expect(Array.from(rgba.subarray(0, 4))).toEqual([0, 0, 0, 0]);
    expect(Array.from(rgba.subarray((8 + 1) * 4, (8 + 1) * 4 + 4))).toEqual([244, 238, 255, 255]);
  });
});

describe('project.create', () => {
  const options = {
    name: 'Fresh',
    bank: {
      name: 'Bxel 16',
      cap: 16,
      transparent: true,
      colors: [{ rgb: '#140B26', name: 'Night' }, { rgb: '#4b1fa0' }],
    },
    sprite: { name: 'hero', width: 8, height: 8 },
  };

  it('returns a document at revision 1 with counter ids', () => {
    const result = projectCreate({ options, ids: counterIdSource() });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { state } = result;
    expect(state.revision).toBe(1);
    expect(state.readOnly).toBe(false);
    expect(state.project.id).toBe('prj_000001');
    expect(state.project.defaultBankId).toBe('bnk_000002');
    expect(state.project.banks[0]?.slots.map((slot) => slot.id)).toEqual(['sw_000003', 'sw_000004', 'sw_000005']);
    expect(state.project.sprites[0]?.id).toBe('spr_000006');
    expect(state.project.sprites[0]?.pivot).toEqual({ x2: 8, y2: 8 });
    expect(state.documentId).toBe('doc_000009');
    const first = state.project.banks[0]?.slots[1];
    expect(first?.kind === 'color' ? first.rgb : null).toBe('#140b26');
  });

  it('labels slot 0 Background in an opaque bank', () => {
    const opaque = { ...options, bank: { ...options.bank, transparent: false } };
    const result = projectCreate({ options: opaque, ids: counterIdSource() });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const slot = result.state.project.banks[0]?.slots[0];
    expect(slot?.kind === 'color' ? slot.name : null).toBe('Night');
    const unnamed = { ...options, bank: { ...options.bank, transparent: false, colors: [{ rgb: '#000000' }] } };
    const second = projectCreate({ options: unnamed, ids: counterIdSource() });
    const background = second.ok ? second.state.project.banks[0]?.slots[0] : undefined;
    expect(background?.kind === 'color' ? background.name : null).toBe('Background');
  });

  it('rejects bad input with the contract codes and consumes no ids', () => {
    const ids = counterIdSource();
    const code = (patch: object): string | null => {
      const result = projectCreate({ options: { ...options, ...patch }, ids });
      return result.ok ? null : result.error.code;
    };
    expect(code({ name: '   ' })).toBe('NAME_INVALID');
    expect(code({ bank: { ...options.bank, cap: 0 } })).toBe('CAP_OUT_OF_RANGE');
    expect(code({ bank: { ...options.bank, cap: 257 } })).toBe('CAP_OUT_OF_RANGE');
    expect(code({ bank: { ...options.bank, colors: [{ rgb: 'red' }] } })).toBe('INVALID_COLOR');
    expect(code({ bank: { ...options.bank, cap: 2 } })).toBe('PALETTE_FULL');
    expect(code({ sprite: { name: 'hero', width: 0, height: 8 } })).toBe('SIZE_OUT_OF_RANGE');
    expect(code({ sprite: { name: 'hero', width: 8, height: 2049 } })).toBe('SIZE_OUT_OF_RANGE');
    expect(code({ unknown: true })).toBe('INVALID_OPTION');
    expect(ids.next('prj')).toBe('prj_000001');
  });
});
