/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { commitRequest } from '../../src/editor/commit-request';
import { useDrawingStore } from '../../src/stores/useDrawingStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { reconcileSymmetry } from '../../src/symmetry/reconcile-symmetry';
import { openRig } from '../selection/selection-harness';
import type { SelectionRig } from '../selection/selection-harness';

let rig: SelectionRig;

const revision = (): number => rig.host.view(rig.documentId)?.state.revision ?? 0;

beforeEach(() => {
  rig = openRig();
  useDrawingStore.getState().patch({ symmetryDiagonal: false, symmetryTurn: false });
  reconcileSymmetry();
});

describe('symmetry kept in the sprite', () => {
  it('writes a toggle and an axis to the sprite as one undo step each, and undo brings the store back', () => {
    const start = revision();
    useToolStore.getState().toggleSymmetry('x');
    reconcileSymmetry();
    expect(rig.target().sprite.symmetry).toEqual({ x: true, y: false, axisX: null, axisY: null, diagonal: false, turn: false });
    useToolStore.getState().setAxis('x', 6);
    reconcileSymmetry();
    expect(rig.target().sprite.symmetry?.axisX).toBe(6);
    expect(revision()).toBe(start + 2);
    rig.host.undo(rig.documentId);
    reconcileSymmetry();
    expect(useToolStore.getState().axisX).toBeNull();
    expect(useToolStore.getState().symmetryX).toBe(true);
    rig.host.undo(rig.documentId);
    reconcileSymmetry();
    expect(useToolStore.getState().symmetryX).toBe(false);
    expect(rig.target().sprite.symmetry).toBeUndefined();
  });

  it('carries the crossing modes and loads what a command or a file set', () => {
    useDrawingStore.getState().toggleSymmetryMode('diagonal');
    reconcileSymmetry();
    expect(rig.target().sprite.symmetry?.diagonal).toBe(true);
    const step = { name: COMMAND_NAME.spriteSymmetry, options: { y: true, axisY: 4, diagonal: false } };
    rig.host.execute(commitRequest(rig.target(), 'Mirror', step));
    reconcileSymmetry();
    expect(useToolStore.getState()).toMatchObject({ symmetryY: true, axisY: 4 });
    expect(useDrawingStore.getState().symmetryDiagonal).toBe(false);
  });

  it('does not touch the document when the store already matches the sprite', () => {
    const start = revision();
    reconcileSymmetry();
    reconcileSymmetry();
    expect(revision()).toBe(start);
  });
});
