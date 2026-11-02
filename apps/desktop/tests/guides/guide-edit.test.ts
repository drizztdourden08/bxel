/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applyGuide } from '../../src/guides/apply-guide';
import { doubleGuide } from '../../src/guides/double-guide';
import { editGuide } from '../../src/guides/edit-guide';
import { guideRows } from '../../src/guides/guide-rows';
import type { GuideScope } from '../../src/guides/guide.type';
import { useGuideDialogStore } from '../../src/stores/useGuideDialogStore';

const scope = vi.hoisted(() => ({ current: null as GuideScope | null }));

vi.mock('../../src/guides/guide-scope', () => ({ guideScope: () => scope.current }));
vi.mock('../../src/guides/show-guides', () => ({ showGuides: () => undefined }));

const make = (x: number[], y: number[]): GuideScope => ({
  lines: () => ({ x, y }),
  size: () => ({ width: 32, height: 16 }),
  step: () => null,
  add: vi.fn(),
  addMany: vi.fn(),
  move: vi.fn(),
  remove: vi.fn(),
  clear: vi.fn(),
});

beforeEach(() => {
  scope.current = make([4, 8], [2]);
  useGuideDialogStore.getState().hide();
});

describe('K1 typed guide positions', { tags: ['critical'] }, () => {
  it('lists the x guides then the y guides', () => {
    expect(guideRows({ x: [4, 8], y: [2] })).toEqual([
      { axis: 'x', position: 4 },
      { axis: 'x', position: 8 },
      { axis: 'y', position: 2 },
    ]);
    expect(guideRows(undefined)).toEqual([]);
  });

  it('moves a guide to a typed position, keeping half pixels and the canvas edge', () => {
    applyGuide({ axis: 'x', from: 4, to: 12.5 });
    applyGuide({ axis: 'y', from: 2, to: 99 });
    expect(scope.current?.move).toHaveBeenNthCalledWith(1, 'x', 4, 12.5);
    expect(scope.current?.move).toHaveBeenNthCalledWith(2, 'y', 2, 16);
  });

  it('adds a new guide when there is no guide to move', () => {
    expect(applyGuide({ axis: 'y', from: null, to: 5 })).toBe(true);
    expect(scope.current?.add).toHaveBeenCalledWith('y', 5);
  });

  it('refuses a position that already has a guide and a value that is not a number', () => {
    expect(applyGuide({ axis: 'x', from: 4, to: 8 })).toBe(false);
    expect(applyGuide({ axis: 'x', from: 4, to: Number.NaN })).toBe(false);
    expect(scope.current?.move).not.toHaveBeenCalled();
  });
});

describe('K1 the guide dialog and the double press', { tags: ['standard'] }, () => {
  it('opens on an existing guide to edit it, and on a free place to add one', () => {
    editGuide({ axis: 'x', position: 8 });
    expect(useGuideDialogStore.getState()).toMatchObject({ open: true, axis: 'x', from: 8, position: 8 });
    editGuide({ axis: 'y', position: 7 });
    expect(useGuideDialogStore.getState()).toMatchObject({ axis: 'y', from: null, position: 7 });
  });

  it('does not open without a canvas', () => {
    scope.current = null;
    editGuide({ axis: 'x', position: 1 });
    expect(useGuideDialogStore.getState().open).toBe(false);
  });

  it('counts two quick presses on the same guide as a double press', () => {
    const last = { axis: 'x' as const, position: 4, at: 1000 };
    expect(doubleGuide(last, { axis: 'x', position: 4 }, 1200)).toBe(true);
    expect(doubleGuide(last, { axis: 'x', position: 4 }, 1600)).toBe(false);
    expect(doubleGuide(last, { axis: 'y', position: 4 }, 1100)).toBe(false);
    expect(doubleGuide(null, { axis: 'x', position: 4 }, 1100)).toBe(false);
  });
});
