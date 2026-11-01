/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { lintPixels } from '../src/lint/lint-pixels';

const grid = (rows: readonly string[]) => {
  const width = rows[0]?.length ?? 0;
  const pixels = Uint8Array.from(rows.join('').split('').map((char) => (char === '.' ? 0 : Number(char))));
  return { pixels, width, height: rows.length };
};

describe('lintPixels', () => {
  test('reports a lone pixel as an orphan and leaves a pair alone', () => {
    const { findings } = lintPixels({ ...grid(['1....', '.....', '..22.', '.....']), rules: ['orphan'] });
    expect(findings).toEqual([{ rule: 'orphan', x: 0, y: 0, width: 1, height: 1, index: 1 }]);
  });

  test('reports the corner pixel of a one pixel staircase as a double', () => {
    const { findings } = lintPixels({ ...grid(['11...', '.1...', '.11..', '.....']), rules: ['double'] });
    expect(findings.map((each) => [each.x, each.y])).toEqual([[1, 0], [1, 2]]);
  });

  test('does not call a thick shape a double', () => {
    const { total } = lintPixels({ ...grid(['11', '11']), rules: ['double'] });
    expect(total).toBe(0);
  });

  test('reports stripes of different colours with the same extent as banding', () => {
    const { findings } = lintPixels({ ...grid(['11111', '22222', '33333', '.....']), rules: ['banding'] });
    expect(findings).toEqual([{ rule: 'banding', x: 0, y: 0, width: 5, height: 3, index: 1 }]);
  });

  test('reports vertical stripes too', () => {
    const { findings } = lintPixels({ ...grid(['123', '123', '123', '123']), rules: ['banding'] });
    expect(findings).toEqual([{ rule: 'banding', x: 0, y: 0, width: 3, height: 4, index: 1 }]);
  });

  test('caps the list and keeps the total', () => {
    const { findings, total } = lintPixels({ ...grid(['1.1.1', '.....', '1.1.1']), rules: ['orphan'], limit: 2 });
    expect(findings).toHaveLength(2);
    expect(total).toBe(6);
  });
});
