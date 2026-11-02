/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { ALL_RULES } from '../../src/ui-context/all-rules.constants';
import { evaluate } from '../../src/ui-context/evaluate';
import { COLUMN_NAMES, columnContext } from './columns';
import type { Column } from './columns';

type Cell = 'shown' | 'disabled' | 'hidden';

type Row = Readonly<Partial<Record<Column, Cell>>>;

const EVERY = (cell: Cell): Row => Object.fromEntries(COLUMN_NAMES.map((column) => [column, cell]));

const MATRIX: Readonly<Record<string, Row>> = {
  'history.undo': EVERY('disabled'),
  'history.redo': EVERY('disabled'),
  'project.close': EVERY('disabled'),
  'tab.close': EVERY('shown'),
  'file.open': EVERY('shown'),
  'asset.rename': EVERY('shown'),
  'image.import': { N: 'hidden', Sp: 'hidden', Se: 'hidden', An: 'hidden', Pa: 'hidden', Sh: 'hidden', Si: 'hidden', Ts: 'hidden', Tm: 'hidden', Te: 'hidden', Ro: 'hidden', Im: 'shown' },
  'timeline.add_frame': { Sp: 'hidden', An: 'shown', Ts: 'shown', Tm: 'hidden' },
  'tool.select_pencil': { N: 'disabled', Sp: 'shown', Pa: 'hidden', Ro: 'disabled' },
  'tool.select_picker': { Sp: 'shown', Ro: 'shown' },
  'tool.select_zoom': { N: 'disabled', Sp: 'shown', Ro: 'shown' },
  'selection.copy': { Sp: 'disabled', Se: 'shown' },
  'selection.paste': { Se: 'disabled' },
};

describe('K1 the context matrix', { tags: ['critical'] }, () => {
  it.each(Object.entries(MATRIX))('%s matches the checked in row', (id, row) => {
    const found = Object.fromEntries(Object.keys(row).map((column) => [column, evaluate(id, columnContext(column as Column)).state]));
    expect(found).toEqual(row);
  });

  it('answers every rule in every column with a valid state', () => {
    for (const id of Object.keys(ALL_RULES)) {
      for (const column of COLUMN_NAMES) {
        const ui = evaluate(id, columnContext(column));
        expect(['shown', 'disabled', 'hidden']).toContain(ui.state);
      }
    }
  });

  it('gives a reason to a disabled item only', () => {
    for (const id of Object.keys(ALL_RULES)) {
      for (const column of COLUMN_NAMES) {
        const ui = evaluate(id, columnContext(column));
        if (ui.state !== 'disabled') expect(ui.reason, `${id} in ${column}`).toBeNull();
      }
    }
  });
});
