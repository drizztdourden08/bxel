/* @layer renderer-app @kind test */
import type { EntryFacts } from '../../src/sheet-manager/manager.type';
import { describe, expect, it } from 'vitest';
import { entryDetail } from '../../src/views/EntryTile/behavior/entry-detail';
import { entryLabel } from '../../src/views/EntryTile/behavior/entry-label';
import type { EntryTileState } from '../../src/views/EntryTile/EntryTile.type';

const state: EntryTileState = { mark: null, selected: false, active: false, affected: false, loose: false, twin: false };

const fact = (over: Partial<EntryFacts>): EntryFacts =>
  ({ kind: 'sprite', sprite: { id: 'a', name: 'hero', width: 16, height: 16 }, bank: '', slices: 0, strip: null, at: { x: 32, y: 48 }, onSheet: true, sheets: ['main'], ...over }) as never;

describe('S2 an entry tile reads its place on the sheet', { tags: ['standard'] }, () => {
  it('adds the position to the name and to the detail when the sprite is on the sheet', () => {
    expect(entryLabel(fact({}), false)).toContain('at 32, 48');
    expect(entryDetail(fact({}), state)).toContain('at 32, 48');
  });

  it('leaves the position out when the sprite is not on this sheet', () => {
    const loose = fact({ onSheet: false, at: null });
    expect(entryLabel(loose, false)).not.toContain(' at ');
    expect(entryDetail(loose, { ...state, loose: true })).toContain('Not on this sheet');
  });
});
