/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { crumbSegments } from '../../src/stage-header/crumb-segments';
import type { Crumb } from '../../src/stage-header/stage-header.type';

const item = (id: string) => ({ id, label: id, onSelect: () => undefined });

describe('crumbSegments', () => {
  it('keeps id, icon, title and label, and puts the note in brackets', { tags: ['critical'] }, () => {
    const crumbs: Crumb[] = [{ id: 'layer', label: 'Body', icon: 'pixel-layers', title: 'The layer', note: 'locked' }];
    expect(crumbSegments(crumbs)).toEqual([
      { id: 'layer', label: 'Body (locked)', title: 'The layer', icon: 'pixel-layers', siblings: undefined, opensMenu: false },
    ]);
  });

  it('turns a menu into siblings that open on press, each tagged with its group label', { tags: ['critical'] }, () => {
    const crumbs: Crumb[] = [
      { id: 'layer', label: 'Body', menu: [{ id: 'a', label: 'Layer', items: [item('x')] }, { id: 'b', label: 'Scope', items: [item('y'), item('z')] }] },
    ];
    const [segment] = crumbSegments(crumbs);
    expect(segment?.opensMenu).toBe(true);
    expect(segment?.siblings?.map((node) => ('separator' in node ? '-' : `${node.group}:${node.id}`))).toEqual(['Layer:x', 'Scope:y', 'Scope:z']);
  });
});
