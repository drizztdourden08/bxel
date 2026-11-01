/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { flattenGroupPlan } from '../../src/editor/flatten-group-plan';
import type { PlanItem } from '../../src/editor/flatten-group-plan.type';
import { moveOutWish } from '../../src/editor/move-out-wish';

const item = (id: string, kind?: string, parentId?: string): PlanItem => ({ id, visible: true, ...(kind ? { kind } : {}), ...(parentId ? { parentId } : {}) });

describe('K1 flatten group plan', { tags: ['critical'] }, () => {
  it('merges the children of a group from the top down, then takes the group apart', () => {
    const layers = [item('a', undefined, 'g'), item('b', undefined, 'g'), item('c', undefined, 'g'), item('g', 'group')];
    expect(flattenGroupPlan(layers, 'g')).toEqual({
      steps: [
        { op: 'merge', id: 'c' },
        { op: 'merge', id: 'b' },
        { op: 'ungroup', id: 'g' },
      ],
      keep: 'a',
    });
  });

  it('flattens an inner group first and keeps its bottom layer in the outer group', () => {
    const layers = [item('x', undefined, 'inner'), item('y', undefined, 'inner'), item('inner', 'group', 'outer'), item('z', undefined, 'outer'), item('outer', 'group')];
    expect(flattenGroupPlan(layers, 'outer')).toEqual({
      steps: [
        { op: 'merge', id: 'y' },
        { op: 'ungroup', id: 'inner' },
        { op: 'merge', id: 'z' },
        { op: 'ungroup', id: 'outer' },
      ],
      keep: 'x',
    });
  });

  it('only takes an empty group apart and keeps no layer', () => {
    expect(flattenGroupPlan([item('g', 'group')], 'g')).toEqual({ steps: [{ op: 'ungroup', id: 'g' }], keep: null });
  });

  it('refuses a layer that is not a group and a group that holds a reference image', () => {
    expect(flattenGroupPlan([item('a')], 'a')).toBeNull();
    expect(flattenGroupPlan([item('a', undefined, 'g'), item('r', 'reference', 'g'), item('g', 'group')], 'g')).toBeNull();
    expect(flattenGroupPlan([item('a')], 'absent')).toBeNull();
  });
});

describe('K1 move out of a group', { tags: ['critical'] }, () => {
  const layers = [item('a', undefined, 'g'), item('b', undefined, 'g'), item('g', 'group'), item('c')];

  it('lifts the picked children to just above their group', () => {
    expect(moveOutWish(layers, ['a'])).toEqual({ keys: ['a'], parentKey: null, index: 1 });
    expect(moveOutWish(layers, ['a', 'b'])).toEqual({ keys: ['b', 'a'], parentKey: null, index: 1 });
  });

  it('does nothing for a layer that is already at the top level', () => {
    expect(moveOutWish(layers, ['c'])).toBeNull();
    expect(moveOutWish(layers, [])).toBeNull();
  });
});
