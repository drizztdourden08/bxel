/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { scopeChips } from '../../src/views/OptionsToolbar/behavior/scope-chips';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

describe('W7 the scope chips of the options bar', { tags: ['standard'] }, () => {
  it('show how many uses a tile edit reaches', () => {
    const chips = scopeChips({ surface: 'tile', tileUses: 3, broadcast: false, selected: 0 });
    expect(chips).toHaveLength(1);
    expect(chips[0]).toMatchObject({ id: 'tile-uses', disabled: true });
    expect(chips[0]?.kind === 'button' && chips[0].caption).toMatch(/3/);
  });

  it('show nothing on a tile before the uses are known', () => {
    expect(scopeChips({ surface: 'tile', tileUses: null, broadcast: false, selected: 0 })).toEqual([]);
  });

  it('show how many sprites a stroke paints only when it is broadcast to several', () => {
    const several = scopeChips({ surface: 'sprite', tileUses: null, broadcast: true, selected: 4 });
    expect(several).toHaveLength(1);
    expect(several[0]?.kind === 'button' && several[0].caption).toMatch(/4/);
    expect(scopeChips({ surface: 'sprite', tileUses: null, broadcast: true, selected: 1 })).toEqual([]);
    expect(scopeChips({ surface: 'sprite', tileUses: null, broadcast: false, selected: 4 })).toEqual([]);
  });
});
