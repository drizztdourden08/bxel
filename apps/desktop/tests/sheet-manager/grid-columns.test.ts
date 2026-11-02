/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import type { Sheet } from '@bxel/document';
import { gridColumns } from '../../src/views/SpritesPanel/behavior/grid-columns';
import { artwork } from '../sheet/sheet-harness';
import { openManagedSheet, spriteFacts } from './manager-harness';

const sheetWith = (layout: Sheet['layout']): Sheet => {
  const sheet = artwork().sheets[0];
  if (sheet === undefined) throw new Error('no sheet');
  return { ...sheet, layout };
};

beforeEach(openManagedSheet);

describe('S2 sprite grid columns', { tags: ['standard'] }, () => {
  it('uses the columns of a grid sheet in manual order', () => {
    const all = spriteFacts();
    const sheet = sheetWith({ kind: 'grid', columns: 5, cellWidth: 8, cellHeight: 8, order: 'rows' });
    expect(gridColumns({ sheet, facts: all, shown: all }, 'manual')).toBe(5);
  });

  it('leaves the columns free for a sorted, filtered or non grid list', () => {
    const all = spriteFacts();
    const grid = sheetWith({ kind: 'grid', columns: 5, cellWidth: 8, cellHeight: 8, order: 'rows' });
    expect(gridColumns({ sheet: grid, facts: all, shown: all }, 'name')).toBeUndefined();
    expect(gridColumns({ sheet: grid, facts: all, shown: all.slice(1) }, 'manual')).toBeUndefined();
    expect(gridColumns({ sheet: sheetWith({ kind: 'manual' }), facts: all, shown: all }, 'manual')).toBeUndefined();
  });
});
