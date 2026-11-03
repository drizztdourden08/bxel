/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { keepShown } from '../../src/project-browser/keep-shown';
import { pickAll } from '../../src/project-browser/pick-all';
import { pickEntry } from '../../src/project-browser/pick-entry';
import { EMPTY_SELECTION } from '../../src/project-browser/project-browser.constants';

const ORDER = ['a', 'b', 'c', 'd', 'e'];

describe('K1 selecting files in the browser', { tags: ['critical'] }, () => {
  it('selects one on a plain click and a range on shift click', () => {
    const first = pickEntry(EMPTY_SELECTION, 'b', ORDER, { ctrl: false, shift: false });
    expect(first.ids).toEqual(['b']);
    const range = pickEntry(first, 'd', ORDER, { ctrl: false, shift: true });
    expect(range.ids).toEqual(['b', 'c', 'd']);
    expect(range.anchor).toBe('b');
  });

  it('adds and takes away single files on control click', () => {
    const one = pickEntry(EMPTY_SELECTION, 'a', ORDER, { ctrl: false, shift: false });
    const two = pickEntry(one, 'c', ORDER, { ctrl: true, shift: false });
    expect(two.ids).toEqual(['a', 'c']);
    expect(pickEntry(two, 'a', ORDER, { ctrl: true, shift: false }).ids).toEqual(['c']);
  });

  it('selects everything shown and drops what is no longer shown', () => {
    expect(pickAll(ORDER).ids).toEqual(ORDER);
    const kept = keepShown({ ids: ['a', 'z'], anchor: 'z' }, ORDER);
    expect(kept.ids).toEqual(['a']);
    expect(kept.anchor).toBe('a');
  });
});
