/* @layer renderer-app @kind test */
import type { StatusBarEntry } from '@drizztdourden08/tessera';
import { describe, expect, it } from 'vitest';
import { foldItems } from '../../src/status-extras/fold-items';
import { foldOrder } from '../../src/status-extras/fold-order';

const item = (id: string, priority?: number): StatusBarEntry => ({ id, label: id, value: id, ...(priority === undefined ? {} : { priority }) });

const bar = [item('cursor'), item('index', 3), item('cell', 2), item('zoom'), item('colour-1', 1), item('colour-2', 2), item('selection', 3), item('help', 3)];

describe('folding the status bar', () => {
  it('names the items that may go, the lowest priority first and the later one first among equals', () => {
    expect(foldOrder(bar)).toEqual(['help', 'selection', 'index', 'colour-2', 'cell', 'colour-1']);
  });

  it('never lists the items that have no priority, so Cursor and Zoom stay', () => {
    expect(foldOrder(bar)).not.toContain('cursor');
    expect(foldOrder(bar)).not.toContain('zoom');
  });

  it('removes whole items one by one and hands the rest on without a priority', () => {
    expect(foldItems(bar, 0).map((each) => each.id)).toEqual(bar.map((each) => each.id));
    expect(foldItems(bar, 2).map((each) => each.id)).toEqual(['cursor', 'index', 'cell', 'zoom', 'colour-1', 'colour-2']);
    expect(foldItems(bar, 99).map((each) => each.id)).toEqual(['cursor', 'zoom']);
    expect(foldItems(bar, 1).every((each) => each.priority === undefined)).toBe(true);
  });
});
