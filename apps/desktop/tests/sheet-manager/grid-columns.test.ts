/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import type { Sheet } from '@bxel/document';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { allFacts } from '../../src/sheet-manager/all-facts';
import type { SpriteFacts } from '../../src/sheet-manager/manager.type';
import { managerSheet } from '../../src/sheet-manager/manager-sheet';
import { useManagerStore } from '../../src/stores/useManagerStore';
import { gridColumns } from '../../src/views/SpritesPanel/behavior/grid-columns';
import { artwork, openFile } from '../sheet/sheet-harness';

const facts = (): SpriteFacts[] => {
  const art = artwork();
  return allFacts(art, managerSheet(art, null, null)).filter((fact): fact is SpriteFacts => fact.kind === 'sprite');
};

const sheetWith = (layout: Sheet['layout']): Sheet => {
  const sheet = artwork().sheets[0];
  if (sheet === undefined) throw new Error('no sheet');
  return { ...sheet, layout };
};

beforeEach(() => {
  openFile(['a', 'b', 'c'], 8);
  addToSheet(artwork().sprites.map((sprite) => sprite.id), null);
  useManagerStore.getState().reset();
});

describe('S2 sprite grid columns', { tags: ['standard'] }, () => {
  it('uses the columns of a grid sheet in manual order', () => {
    const all = facts();
    const sheet = sheetWith({ kind: 'grid', columns: 5, cellWidth: 8, cellHeight: 8, order: [] });
    expect(gridColumns({ sheet, facts: all, shown: all }, 'manual')).toBe(5);
  });

  it('leaves the columns free for a sorted, filtered or non grid list', () => {
    const all = facts();
    const grid = sheetWith({ kind: 'grid', columns: 5, cellWidth: 8, cellHeight: 8, order: [] });
    expect(gridColumns({ sheet: grid, facts: all, shown: all }, 'name')).toBeUndefined();
    expect(gridColumns({ sheet: grid, facts: all, shown: all.slice(1) }, 'manual')).toBeUndefined();
    expect(gridColumns({ sheet: sheetWith({ kind: 'manual' }), facts: all, shown: all }, 'manual')).toBeUndefined();
  });
});
