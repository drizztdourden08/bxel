/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { PENDING_TEXT } from '../../src/editor/pending/pending.constants';
import { seamNote } from '../../src/editor/pending/seam-note';
import { IDENTITY } from '../../src/editor/transform/transform.constants';

describe('free rotate on a tile', { tags: ['standard'] }, () => {
  it('warns about seams for a free angle on a tile only', () => {
    expect(seamNote({ role: 'tile' }, { ...IDENTITY, angle: 17 })).toBe(PENDING_TEXT.seams);
    expect(seamNote({ role: 'sprite' }, { ...IDENTITY, angle: 17 })).toBeNull();
  });

  it('stays quiet for exact quarter turns and plain moves', () => {
    expect(seamNote({ role: 'tile' }, { ...IDENTITY, angle: 90 })).toBeNull();
    expect(seamNote({ role: 'tile' }, { ...IDENTITY, angle: 270 })).toBeNull();
    expect(seamNote({ role: 'tile' }, { ...IDENTITY })).toBeNull();
    expect(seamNote({ role: 'tile' }, { kind: 'flip', axis: 'horizontal' })).toBeNull();
  });
});
