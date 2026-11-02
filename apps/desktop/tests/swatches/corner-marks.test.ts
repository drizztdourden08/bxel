/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { cornerMarks } from '../../src/views/PalettePanel/behavior/corner-marks';

describe('Swatch marks by corner', { tags: ['standard'] }, () => {
  it('puts each held colour mark in its own corner', () => {
    expect(cornerMarks([1, 2, 3, 4])).toEqual({ 'top-start': 1, 'bottom-start': 2, 'top-end': 3, 'bottom-end': 4 });
  });

  it('skips a mark that has no corner and gives nothing for no marks', () => {
    expect(cornerMarks([7])).toEqual({});
    expect(cornerMarks([])).toEqual({});
  });
});
