/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { crumbSegments } from '../../src/stage-header/crumb-segments';
import type { Crumb } from '../../src/stage-header/stage-header.type';

const item = (id: string) => ({ id, label: id, onSelect: () => undefined });

describe('crumbSegments', () => {
  it('keeps id, icon and label, and puts the note in brackets', () => {
    const crumbs: Crumb[] = [{ id: 'layer', label: 'Body', icon: 'pixel-layers', note: 'locked' }];
    expect(crumbSegments(crumbs)).toEqual([
      { id: 'layer', label: 'Body (locked)', icon: 'pixel-layers', siblings: undefined, opensMenu: false },
    ]);
  });

  it('turns a menu into siblings that open on press, with a separator between groups', () => {
    const crumbs: Crumb[] = [{ id: 'layer', label: 'Body', menu: [{ id: 'a', items: [item('x')] }, { id: 'b', items: [item('y')] }] }];
    const [segment] = crumbSegments(crumbs);
    expect(segment?.opensMenu).toBe(true);
    expect(segment?.siblings?.map((node) => ('separator' in node ? '-' : node.id))).toEqual(['x', '-', 'y']);
  });
});
