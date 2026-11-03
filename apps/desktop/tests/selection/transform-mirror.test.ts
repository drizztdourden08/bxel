/* @layer renderer-app @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { commitPending } from '../../src/editor/pending/commit-pending';
import { setMirror } from '../../src/editor/transform/set-mirror';
import { startFlip } from '../../src/editor/transform/start-flip';
import { startTransform } from '../../src/editor/transform/start-transform';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { useTransformUiStore } from '../../src/stores/useTransformUiStore';
import { at, openRig } from './selection-harness';
import type { SelectionRig } from './selection-harness';

const LEFT = { x: 2, y: 4, width: 4, height: 3 };

const RIGHT = { x: 26, y: 4, width: 4, height: 3 };

const paintBoth = (rig: SelectionRig): void => {
  for (const box of [LEFT, RIGHT]) {
    rig.paint({ ...box, height: 1 }, 3);
    rig.paint({ ...box, y: box.y + 2, height: 1 }, 5);
  }
};

const withSymmetry = (): SelectionRig => {
  const rig = openRig();
  useToolStore.setState({ symmetryX: true });
  paintBoth(rig);
  rig.select(LEFT);
  return rig;
};

const previewIndices = (): Uint8Array | undefined => usePendingStore.getState().outcome?.frame?.indices;

const reviseOffset = (): void => {
  const spec = usePendingStore.getState().pending?.spec;
  if (spec?.kind !== 'transform') throw new Error('no transform session');
  usePendingStore.getState().revise({ ...spec, algorithm: 'nearest', offset: { x: 1, y: 0 } });
};

afterEach(() => {
  useTransformUiStore.getState().setMirror(false);
});

describe('S2 the transform session with symmetry', { tags: ['standard'] }, () => {
  it('flips only the selected side when mirroring is off', () => {
    const rig = withSymmetry();
    startFlip('vertical');
    expect(commitPending()).toBe(true);
    expect(rig.pixels()[at(3, 4)]).toBe(5);
    expect(rig.pixels()[at(27, 4)]).toBe(3);
  });

  it('flips the mirrored side too when mirroring is on', () => {
    const rig = withSymmetry();
    useTransformUiStore.getState().setMirror(true);
    startFlip('vertical');
    expect(commitPending()).toBe(true);
    expect(rig.pixels()[at(3, 4)]).toBe(5);
    expect(rig.pixels()[at(27, 4)]).toBe(5);
    expect(rig.pixels()[at(27, 6)]).toBe(3);
  });

  it('moves the mirrored side the opposite way and previews the change at once', () => {
    withSymmetry();
    startTransform();
    reviseOffset();
    expect(previewIndices()?.[at(2, 4)]).toBe(0);
    expect(previewIndices()?.[at(29, 4)]).toBe(3);
    setMirror(true);
    const preview = previewIndices();
    expect(preview?.[at(6, 4)]).toBe(3);
    expect(preview?.[at(25, 4)]).toBe(3);
    expect(preview?.[at(29, 4)]).toBe(0);
  });
});
