/* @layer renderer-app @kind test */
import { rectMask } from '@bxel/raster';
import { describe, expect, it } from 'vitest';
import { beginStroke } from '../../src/editor/begin-stroke';
import { extendStroke } from '../../src/editor/extend-stroke';
import { fillRequest } from '../../src/editor/fill-request';
import { strokeRequest } from '../../src/editor/stroke-request';
import { celPixels } from '../../src/editor/selection/cel-pixels';
import { clearSelection } from '../../src/editor/selection/clear-selection';
import { incomingMask } from '../../src/editor/selection/incoming-mask';
import { invertSelection } from '../../src/editor/selection/invert-selection';
import { maskOutline } from '../../src/editor/selection/mask-outline';
import { mergeMask } from '../../src/editor/selection/merge-mask';
import { modeOf } from '../../src/editor/selection/mode-of';
import { pointMask } from '../../src/editor/selection/point-mask';
import { resizeSelection } from '../../src/editor/selection/resize-selection';
import { selectAll } from '../../src/editor/selection/select-all';
import { selectionMask } from '../../src/editor/selection/selection-mask';
import { useSelectionStore } from '../../src/stores/useSelectionStore';
import { plainOptions } from '../editor/editor-harness';
import { countOn, openRig } from './selection-harness';

const square = (from: number, to: number) => ({ variant: 'rect', from: { x: from, y: from }, to: { x: to, y: to }, path: [] }) as const;

describe('the selection modes', () => {
  const size = { width: 8, height: 8 };
  const first = incomingMask(square(1, 4), size);
  const second = incomingMask(square(3, 6), size);

  it('replace, add, subtract and intersect combine two shapes', () => {
    expect(countOn(mergeMask(first, second, 'replace'))).toBe(16);
    expect(countOn(mergeMask(first, second, 'add'))).toBe(16 + 16 - 4);
    expect(countOn(mergeMask(first, second, 'subtract'))).toBe(16 - 4);
    expect(countOn(mergeMask(first, second, 'intersect'))).toBe(4);
  });

  it('starts from nothing: add keeps the shape, subtract and intersect keep nothing', () => {
    expect(countOn(mergeMask(null, first, 'add'))).toBe(16);
    expect(mergeMask(null, first, 'subtract')).toBeNull();
    expect(mergeMask(null, first, 'intersect')).toBeNull();
  });

  it('turns an empty result into no selection', () => {
    expect(mergeMask(first, first, 'subtract')).toBeNull();
  });

  it('reads Shift as add, Alt as subtract and both as intersect', () => {
    expect(modeOf({ shiftKey: false, altKey: false }, 'replace')).toBe('replace');
    expect(modeOf({ shiftKey: true, altKey: false }, 'replace')).toBe('add');
    expect(modeOf({ shiftKey: false, altKey: true }, 'replace')).toBe('subtract');
    expect(modeOf({ shiftKey: true, altKey: true }, 'replace')).toBe('intersect');
    expect(modeOf({ shiftKey: false, altKey: false }, 'intersect')).toBe('intersect');
  });
});

describe('the selection commands', () => {
  it('select all, invert, expand, shrink and deselect change the session mask', () => {
    const rig = openRig();
    selectAll();
    expect(countOn(selectionMask(rig.target()))).toBe(32 * 32);
    invertSelection();
    expect(selectionMask(rig.target())).toBeNull();
    rig.select({ x: 10, y: 10, width: 4, height: 4 });
    resizeSelection(1);
    expect(countOn(selectionMask(rig.target()))).toBe(36);
    resizeSelection(-1);
    resizeSelection(-1);
    expect(countOn(selectionMask(rig.target()))).toBe(4);
    invertSelection();
    expect(countOn(selectionMask(rig.target()))).toBe(32 * 32 - 4);
    clearSelection();
    expect(selectionMask(rig.target())).toBeNull();
  });

  it('keeps the selection out of the file and drops it on another document', () => {
    const rig = openRig();
    const revision = rig.target().revision;
    rig.select({ x: 0, y: 0, width: 2, height: 2 });
    expect(rig.target().revision).toBe(revision);
    expect(rig.host.view(rig.documentId)?.canUndo).toBe(false);
    const other = openRig();
    expect(other.documentId).not.toBe(rig.documentId);
    expect(selectionMask(other.target())).toBeNull();
  });

  it('selects by wand with 4 or 8 neighbours and by colour', () => {
    const rig = openRig();
    rig.paint({ x: 2, y: 2, width: 1, height: 1 }, 5);
    rig.paint({ x: 3, y: 3, width: 1, height: 1 }, 5);
    rig.paint({ x: 10, y: 10, width: 1, height: 1 }, 5);
    const at = { x: 2, y: 2 };
    expect(countOn(pointMask(rig.target(), 'wand', at, 4))).toBe(1);
    expect(countOn(pointMask(rig.target(), 'wand', at, 8))).toBe(2);
    expect(countOn(pointMask(rig.target(), 'colour', at, 4))).toBe(3);
    expect(celPixels(rig.target())[2 * 32 + 2]).toBe(5);
  });
});

describe('the outline', () => {
  it('walks the edge of a pixel and merges straight runs', () => {
    const one = rectMask({ width: 4, height: 4 }, { from: { x: 1, y: 1 }, to: { x: 1, y: 1 } });
    expect(maskOutline(one)).toHaveLength(16);
    const wide = rectMask({ width: 4, height: 4 }, { from: { x: 1, y: 1 }, to: { x: 2, y: 1 } });
    expect(maskOutline(wide)).toHaveLength(16);
  });
});

describe('the pixel tools honour the selection', () => {
  it('keeps a pencil stroke inside the mask, in the overlay and in the commit', () => {
    const rig = openRig();
    rig.select({ x: 0, y: 0, width: 4, height: 4 });
    const session = beginStroke({ target: rig.target(), tool: 'pencil', index: 3, options: plainOptions, at: { x: 1, y: 1 } });
    extendStroke(session, { x: 8, y: 1 });
    const row = (data: Uint8Array): number[] => Array.from(data.subarray(32, 32 + 10));
    expect(row(session.indices)).toEqual([0, 3, 3, 3, 0, 0, 0, 0, 0, 0]);
    rig.host.execute(strokeRequest(rig.target(), session));
    expect(row(rig.pixels())).toEqual(row(session.indices));
  });

  it('keeps a fill inside the mask', () => {
    const rig = openRig();
    rig.select({ x: 4, y: 4, width: 3, height: 3 });
    rig.host.execute(fillRequest(rig.target(), { x: 5, y: 5 }, { index: 2, mode: 'contiguous', connectivity: 4 }));
    expect(rig.pixels().filter((value) => value === 2)).toHaveLength(9);
    expect(useSelectionStore.getState().mask).not.toBeNull();
  });
});
