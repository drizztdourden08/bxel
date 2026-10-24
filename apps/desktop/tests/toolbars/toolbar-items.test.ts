/* @layer renderer-app @kind test */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { describe, expect, it, vi } from 'vitest';
import { choose } from '../../src/toolbar-items/choose';
import { hintChoice } from '../../src/toolbar-items/hint-choice';
import { hintFace } from '../../src/toolbar-items/hint-face';
import { toggleItem } from '../../src/toolbar-items/toggle-item';
import { tiledGroups } from '../../src/views/CanvasToolbar/behavior/tiled-groups';
import { joinOptions } from '../../src/views/OptionsToolbar/behavior/join-options';
import type { OptionItems } from '../../src/views/OptionsToolbar/OptionsToolbar.type';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../keymap/brock-react-mock')).brockReactMock());

const button = (id: string): ToolbarItem => ({ kind: 'button', id, label: id, icon: 'check', onSelect: () => undefined });

describe('the toolbar items', () => {
  it('take the name and the description of a hint and keep the key off the label', () => {
    const face = hintFace({ name: 'Mirror X', description: 'Mirror strokes.', shortcuts: [{ keys: ['shift'], label: 'Hold' }] });
    expect(face).toEqual({ label: 'Mirror X', description: 'Mirror strokes.', shortcut: ['shift'] });
    expect(face.label).not.toMatch(/[()+]/);
  });

  it('prefer the key bound in the keymap over the fixed key of a hint', () => {
    const face = hintFace({ name: 'Undo', description: 'Take back.', shortcuts: [{ keys: ['x'] }] }, ['ctrl', 'z']);
    expect(face.shortcut).toEqual(['ctrl', 'z']);
  });

  it('build a toggle with a caption only when one is given', () => {
    const hint = { name: 'Rulers', description: 'Show rulers.' };
    const plain = toggleItem({ id: 'rulers', icon: 'hash', hint, pressed: true, onChange: () => undefined });
    const named = toggleItem({ id: 'rulers', icon: 'hash', hint, caption: 'Rulers', pressed: false, onChange: () => undefined });
    expect(plain.caption).toBeUndefined();
    expect(named.caption).toBe('Rulers');
    expect(plain.pressed).toBe(true);
  });

  it('build a choice with the icon, the name and the description of its hint', () => {
    const choice = hintChoice('square', 'square', { name: 'Square', description: 'A square tip.' });
    expect(choice).toMatchObject({ value: 'square', icon: 'square', label: 'Square', description: 'A square tip.' });
  });

  it('apply a picked value only when it is one of the known values', () => {
    const seen: string[] = [];
    const pick = choose(['a', 'b'] as const, (value) => seen.push(value));
    pick('b');
    pick('zzz');
    expect(seen).toEqual(['b']);
  });

  it('put a separator between the kinds of options and none before the first', () => {
    const items: OptionItems = {
      brush: [button('size')], pixelPerfect: [button('perfect')], fill: [], shape: [], select: [], mapFlags: [], mapFilled: [], mapSelection: [],
    };
    const joined = joinOptions(['brush', 'pixelPerfect'], items);
    expect(joined.map((item) => item.id)).toEqual(['size', 'before-pixelPerfect', 'perfect']);
    expect(joinOptions([], items)).toEqual([]);
  });

  it('list the four tiled preview modes and check the current one', () => {
    const [group] = tiledGroups('x', () => undefined);
    const checked = group?.items.flatMap((node) => ('separator' in node || !node.checked ? [] : [node.id]));
    expect(group?.items).toHaveLength(4);
    expect(checked).toEqual(['x']);
  });
});
