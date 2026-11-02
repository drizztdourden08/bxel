/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { ADVANCED_COMMAND } from '@bxel/raster';
import { magnifyChoices } from '../../src/editor/transform/magnify-choices';
import { settleAlgorithm } from '../../src/editor/transform/settle-algorithm';
import { snapAngle } from '../../src/editor/transform/snap-angle';
import { ANGLE_SNAPS, IDENTITY } from '../../src/editor/transform/transform.constants';
import type { TransformSpec } from '../../src/editor/transform/transform.type';
import { magnifyStep } from '../../src/editor/pending/magnify-step';

const doubled: TransformSpec = { ...IDENTITY, scale: { x: 2, y: 2 } };

describe('W8 transform bar choices', { tags: ['standard'] }, () => {
  it('offers the whole factor methods only for an untouched whole scale', () => {
    expect(magnifyChoices(doubled)).toEqual(['scale2x', 'mmpx']);
    expect(magnifyChoices({ ...IDENTITY, scale: { x: 3, y: 3 } })).toEqual(['scale3x']);
    expect(magnifyChoices({ ...IDENTITY, scale: { x: 2.5, y: 2.5 } })).toEqual([]);
    expect(magnifyChoices({ ...doubled, angle: 10 })).toEqual([]);
    expect(magnifyChoices({ ...doubled, offset: { x: 1, y: 0 } })).toEqual([]);
  });

  it('falls back to the default method when a whole factor method no longer fits', () => {
    expect(settleAlgorithm({ ...doubled, algorithm: 'mmpx' }).algorithm).toBe('mmpx');
    expect(settleAlgorithm({ ...doubled, angle: 5, algorithm: 'mmpx' }).algorithm).toBe('rotsprite');
    expect(settleAlgorithm({ ...IDENTITY, algorithm: 'cleanedge' }).algorithm).toBe('cleanedge');
  });

  it('commits a whole factor method as pixels.scale from the centre', () => {
    const step = magnifyStep({ ...doubled, algorithm: 'scale2x' }, null);
    expect(step?.name).toBe(ADVANCED_COMMAND.pixelsScale);
    expect(step?.options).toMatchObject({ target: { by: 'factor', x: 2, y: 2 }, anchor: 'center', algorithm: 'scale2x' });
    expect(magnifyStep({ ...doubled, algorithm: 'nearest' }, null)).toBeNull();
  });

  it('snaps an angle to the chosen step', () => {
    expect(ANGLE_SNAPS).toEqual([15, 22.5, 45]);
    expect(snapAngle(20, 22.5)).toBe(22.5);
    expect(snapAngle(40, 45)).toBe(45);
    expect(snapAngle(40)).toBe(45);
  });
});
