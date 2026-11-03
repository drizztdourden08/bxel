/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { evaluate } from '../../src/ui-context/evaluate';
import { COLUMN_NAMES, columnContext } from './columns';
import type { Column } from './columns';
import { rowOf } from './rows';
import type { Row } from './rows';

const EDITABLE: readonly Column[] = ['Sp', 'Se', 'An', 'Si', 'Ts', 'Tm', 'Te'];

const MATRIX: Readonly<Record<string, Row>> = {
  'transform.flip_horizontal': rowOf(EDITABLE, ['Ro']),
  'layer.add': rowOf(EDITABLE, ['Ro']),
  'canvas.trim': rowOf(['Sp', 'Se', 'An', 'Si'], ['Ro']),
  'palette.add_colour': rowOf(['Sp', 'Se', 'An', 'Pa', 'Si', 'Ts', 'Te'], ['Ro']),
  'palette.copy_hex': rowOf(['Sp', 'Se', 'An', 'Pa', 'Si', 'Ts', 'Te', 'Ro']),
  'selection.select_all': rowOf([...EDITABLE, 'Ro'], ['N']),
  'selection.paste': rowOf([], ['N', ...EDITABLE, 'Ro']),
  'selection.delete': rowOf(['Se'], ['N', 'Sp', 'An', 'Si', 'Ts', 'Tm', 'Te', 'Ro']),
  'view.zoom_in': rowOf(['Sp', 'Se', 'An', 'Sh', 'Si', 'Ts', 'Tm', 'Te', 'Ro', 'Im'], ['N']),
  'view.toggle_rulers': rowOf(['Sp', 'Se', 'An', 'Sh', 'Si', 'Ts', 'Tm', 'Te', 'Ro']),
  'slice.to_selection': rowOf(['Sp', 'Se', 'An', 'Si', 'Ts', 'Te', 'Ro']),
  'tilemap.place_tiles': rowOf(['Tm', 'Te']),
  'tilemap.clear_cells': rowOf([], ['Tm']),
  'sprite.duplicate': rowOf(['Sh']),
  'sprite.back': rowOf(['Si']),
  'file.save': rowOf([...EDITABLE, 'Pa', 'Sh'], ['N', 'Ro', 'Im']),
  'file.save_as': rowOf([...EDITABLE, 'Pa', 'Sh', 'Ro'], ['N', 'Im']),
  'export.open': rowOf([...EDITABLE, 'Pa', 'Sh', 'Ro'], ['N']),
  'project.settings': rowOf([], [...COLUMN_NAMES]),
};

describe('W10 the context matrix, wider', { tags: ['critical'] }, () => {
  it.each(Object.entries(MATRIX))('%s matches the checked in row', (id, row) => {
    const found = Object.fromEntries(COLUMN_NAMES.map((column) => [column, evaluate(id, columnContext(column)).state]));
    expect(found).toEqual(row);
  });

  it('opens a project command once a project is open', () => {
    expect(evaluate('project.settings', columnContext('N', { projectOpen: true })).state).toBe('shown');
  });

  it('lets a selection or a clipboard enable the commands that wait on them', () => {
    expect(evaluate('selection.paste', columnContext('Sp', { clipboard: 'pixels' })).state).toBe('shown');
    expect(evaluate('tilemap.clear_cells', columnContext('Tm', { cellSelection: true })).state).toBe('shown');
    expect(evaluate('selection.delete', columnContext('Tm', { cellSelection: true })).state).toBe('shown');
  });
});
