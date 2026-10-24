/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { applyTransform } from './support/apply-transform';
import { flipGrid } from './support/flip-grid';
import { MARKS_SIDE } from './support/marks.constants';
import { openTransformRig } from './support/open-transform-rig';
import { turnGrid } from './support/turn-grid';
import { useRig } from './support/use-rig';

describe('check 4: flips and quarter turns round trip exactly', () => {
  const rig = useRig(openTransformRig);
  const repeat = async (action: string, times: number) => {
    for (let count = 0; count < times; count += 1) await applyTransform(rig().session, action);
  };

  test('the sprite is asymmetric and one flip or turn matches the expected pixels', async () => {
    const { original, shown } = rig();
    expect(original.some((index) => index !== 0)).toBe(true);
    expect([...flipGrid(original, MARKS_SIDE)]).not.toEqual([...original]);
    expect([...turnGrid(original, MARKS_SIDE)]).not.toEqual([...original]);
    await repeat('Flip horizontal', 1);
    expect([...await shown()]).toEqual([...flipGrid(original, MARKS_SIDE)]);
    await repeat('Flip horizontal', 1);
    expect([...await shown()]).toEqual([...original]);
    await repeat('Rotate 90 clockwise', 1);
    expect([...await shown()]).toEqual([...turnGrid(original, MARKS_SIDE)]);
    await repeat('Rotate 90 counterclockwise', 1);
    expect([...await shown()]).toEqual([...original]);
  });

  test('four flips and four quarter turns return the exact pixels', async () => {
    const { original, shown } = rig();
    for (const action of ['Flip horizontal', 'Flip vertical', 'Rotate 90 clockwise', 'Rotate 90 counterclockwise']) {
      await repeat(action, 4);
      expect([...await shown()], action).toEqual([...original]);
    }
  });
});
