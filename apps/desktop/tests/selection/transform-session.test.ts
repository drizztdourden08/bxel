/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { ADVANCED_COMMAND } from '@bxel/raster';
import { commitRequest } from '../../src/editor/commit-request';
import { cancelPending } from '../../src/editor/pending/cancel-pending';
import { commitPending } from '../../src/editor/pending/commit-pending';
import { regionBox } from '../../src/editor/pending/region-box';
import { applyField } from '../../src/editor/transform/apply-field';
import { dragTransform } from '../../src/editor/transform/drag-transform';
import { fieldValue } from '../../src/editor/transform/field-value';
import { grabOf } from '../../src/editor/transform/grab-of';
import { hitHandle } from '../../src/editor/transform/hit-handle';
import { pivotPoint } from '../../src/editor/transform/pivot-point';
import { specQuad } from '../../src/editor/transform/spec-quad';
import { startFlip } from '../../src/editor/transform/start-flip';
import { startTransform } from '../../src/editor/transform/start-transform';
import { startTurn } from '../../src/editor/transform/start-turn';
import { IDENTITY } from '../../src/editor/transform/transform.constants';
import type { Handle, HeldKeys, TransformSpec } from '../../src/editor/transform/transform.type';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { at, BLOCK, openRig } from './selection-harness';
import type { SelectionRig } from './selection-harness';

const NO_KEYS: HeldKeys = { shiftKey: false, altKey: false, ctrlKey: false };

const specOf = (): TransformSpec => {
  const spec = usePendingStore.getState().pending?.spec;
  if (spec?.kind !== 'transform') throw new Error('no transform session');
  return spec;
};

const dragHandle = (rig: SelectionRig, handle: Handle, to: { x: number; y: number }, keys: HeldKeys = NO_KEYS): void => {
  const pending = usePendingStore.getState().pending;
  const spec = specOf();
  const box = regionBox(rig.target(), pending?.mask ?? null);
  const quad = specQuad(box, spec);
  const start = handle.kind === 'corner' ? quad[handle.index] : { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  const grab = grabOf({ box, spec, point: start ?? { x: 0, y: 0 }, handle }, keys);
  usePendingStore.getState().revise(dragTransform(grab, to, keys));
};

const sendOverMcp = (rig: SelectionRig, angle: number, mask: boolean): Uint8Array => {
  const options = mask ? { angle, algorithm: 'rotsprite', mask: rig.select(BLOCK) } : { angle, algorithm: 'rotsprite' };
  rig.host.execute(commitRequest(rig.target(), 'Rotate', { name: ADVANCED_COMMAND.pixelsTransform, options }));
  return rig.pixels();
};

describe('the transform session', () => {
  it('rotating by the handle to 30 degrees and applying equals pixels.transform with angle 30', () => {
    const rig = openRig();
    rig.paint({ x: 8, y: 8, width: 12, height: 8 }, 4);
    rig.paint({ x: 10, y: 10, width: 3, height: 3 }, 7);
    const before = rig.pixels();
    expect(startTransform()).toBe(true);
    const spec = specOf();
    const box = regionBox(rig.target(), null);
    const centre = pivotPoint(box, spec);
    const radius = 20;
    const start = { x: centre.x + radius, y: centre.y };
    const grab = grabOf({ box, spec, point: start, handle: { kind: 'rotate', index: 1 } }, NO_KEYS);
    const to = { x: centre.x + radius * Math.cos(Math.PI / 6), y: centre.y + radius * Math.sin(Math.PI / 6) };
    usePendingStore.getState().revise(dragTransform(grab, to, NO_KEYS));
    expect(specOf().angle).toBeCloseTo(30, 0);
    usePendingStore.getState().revise({ ...specOf(), angle: 30 });
    expect(commitPending()).toBe(true);
    const viaHandles = rig.pixels();
    expect(viaHandles).not.toEqual(before);
    rig.host.undo(rig.documentId);
    expect(rig.pixels()).toEqual(before);
    expect(sendOverMcp(rig, 30, false)).toEqual(viaHandles);
  });

  it('shift snaps the angle to 15 degree steps', () => {
    const rig = openRig();
    rig.paint({ x: 8, y: 8, width: 12, height: 8 }, 4);
    startTransform();
    const box = regionBox(rig.target(), null);
    const centre = pivotPoint(box, specOf());
    const grab = grabOf({ box, spec: specOf(), point: { x: centre.x + 10, y: centre.y }, handle: { kind: 'rotate', index: 1 } }, NO_KEYS);
    const to = { x: centre.x + 10 * Math.cos(0.5), y: centre.y + 10 * Math.sin(0.5) };
    expect(dragTransform(grab, to, { ...NO_KEYS, shiftKey: true }).angle % 15).toBe(0);
  });

  it('escape restores the pixels exactly and a commit is one undo step', () => {
    const rig = openRig();
    rig.paint(BLOCK, 4);
    rig.select(BLOCK);
    const before = rig.pixels();
    startTransform();
    usePendingStore.getState().revise({ ...specOf(), angle: 45 });
    cancelPending();
    expect(rig.pixels()).toEqual(before);
    startTransform();
    usePendingStore.getState().revise({ ...specOf(), algorithm: 'nearest', scale: { x: 2, y: 2 } });
    commitPending();
    expect(rig.pixels()).not.toEqual(before);
    rig.host.undo(rig.documentId);
    expect(rig.pixels()).toEqual(before);
  });

});

describe('the transform session boxes', () => {
  it('dragging a corner scales to whole pixel sizes and keeps the opposite corner in place', () => {
    const rig = openRig();
    rig.paint(BLOCK, 4);
    rig.select(BLOCK);
    startTransform();
    dragHandle(rig, { kind: 'corner', index: 2 }, { x: BLOCK.x + BLOCK.width + 4, y: BLOCK.y + BLOCK.height + 3 });
    const box = regionBox(rig.target(), usePendingStore.getState().pending?.mask ?? null);
    const quad = specQuad(box, specOf());
    expect(quad[0].x).toBeCloseTo(BLOCK.x);
    expect(quad[0].y).toBeCloseTo(BLOCK.y);
    expect(fieldValue(box, specOf(), 'width')).toBe(8);
    expect(fieldValue(box, specOf(), 'height')).toBe(6);
  });

  it('the number fields drive the same session', () => {
    const rig = openRig();
    rig.paint(BLOCK, 4);
    rig.select(BLOCK);
    startTransform();
    const box = regionBox(rig.target(), usePendingStore.getState().pending?.mask ?? null);
    usePendingStore.getState().revise(applyField(box, specOf(), 'width', 8));
    usePendingStore.getState().revise(applyField(box, specOf(), 'x', 10));
    expect(fieldValue(box, specOf(), 'width')).toBe(8);
    expect(fieldValue(box, specOf(), 'x')).toBe(10);
  });

  it('flips and turns inside the session stay exact', () => {
    const rig = openRig();
    rig.paint({ x: 4, y: 4, width: 2, height: 1 }, 3);
    rig.paint({ x: 6, y: 4, width: 1, height: 1 }, 5);
    rig.select({ x: 4, y: 4, width: 4, height: 1 });
    startTransform();
    startFlip('horizontal');
    commitPending();
    expect(rig.pixels()[at(7, 4)]).toBe(3);
    expect(rig.pixels()[at(5, 4)]).toBe(5);
    startTransform();
    startTurn('half');
    commitPending();
    expect(rig.pixels()[at(4, 4)]).toBe(3);
  });

});

describe('the transform session targets', () => {
  it('hit testing finds the pivot, a corner, the body and the rotate zone', () => {
    const quad = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }] as const;
    const base = { quad, pivot: { x: 5, y: 5 }, zoom: 4 };
    expect(hitHandle({ ...base, point: { x: 5, y: 5 } })?.kind).toBe('pivot');
    expect(hitHandle({ ...base, point: { x: 10.1, y: 0.1 } })).toEqual({ kind: 'corner', index: 1 });
    expect(hitHandle({ ...base, point: { x: 5, y: 0.1 } })).toEqual({ kind: 'edge', index: 0 });
    expect(hitHandle({ ...base, point: { x: 3, y: 7 } })?.kind).toBe('body');
    expect(hitHandle({ ...base, point: { x: 12, y: -2 } })?.kind).toBe('rotate');
    expect(hitHandle({ ...base, point: { x: 40, y: 40 } })).toBeNull();
  });

  it('the identity session keeps the pixels and distorting corners converts to pixels.distort', () => {
    const rig = openRig();
    rig.paint(BLOCK, 4);
    rig.select(BLOCK);
    const before = rig.pixels();
    startTransform();
    expect(usePendingStore.getState().outcome?.frame?.indices).toEqual(before);
    const box = regionBox(rig.target(), usePendingStore.getState().pending?.mask ?? null);
    dragHandle(rig, { kind: 'corner', index: 0 }, { x: BLOCK.x + 1, y: BLOCK.y }, { ...NO_KEYS, ctrlKey: true });
    expect(specOf().corners).not.toBeNull();
    expect(specQuad(box, specOf())[0]).toEqual({ x: BLOCK.x + 1, y: BLOCK.y });
    expect(usePendingStore.getState().outcome?.error).toBeNull();
    expect(IDENTITY.corners).toBeNull();
  });
});
