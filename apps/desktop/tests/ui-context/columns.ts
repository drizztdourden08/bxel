/* @layer renderer-app @kind test */
import type { BxelContext, ContextInput } from '../../src/ui-context/bxel-context.type';
import { deriveContext } from '../../src/ui-context/derive-context';

const BASE: ContextInput = {
  tabKind: null,
  imageActive: false,
  isolated: false,
  tileEdit: 'place',
  pixelSelection: false,
  cellSelection: false,
  spriteSelection: 0,
  frameSelection: 0,
  clipboard: 'none',
  pending: false,
  tool: 'pencil',
  animatedTile: false,
  readOnly: false,
  projectOpen: false,
  canUndo: false,
  canRedo: false,
};

const COLUMN_NAMES = ['N', 'Sp', 'Se', 'An', 'Pa', 'Sh', 'Si', 'Ts', 'Tm', 'Te', 'Ro', 'Im'] as const;

type Column = (typeof COLUMN_NAMES)[number];

const COLUMN_INPUTS: Readonly<Record<Column, Partial<ContextInput>>> = {
  N: {},
  Sp: { tabKind: 'sprite' },
  Se: { tabKind: 'sprite', pixelSelection: true },
  An: { tabKind: 'animation', frameSelection: 1 },
  Pa: { tabKind: 'palette' },
  Sh: { tabKind: 'sheet' },
  Si: { tabKind: 'sheet', isolated: true },
  Ts: { tabKind: 'tileset', tileEdit: 'edit' },
  Tm: { tabKind: 'tilemap', tileEdit: 'place' },
  Te: { tabKind: 'tilemap', tileEdit: 'edit' },
  Ro: { tabKind: 'sprite', readOnly: true },
  Im: { imageActive: true },
};

const columnInput = (column: Column, extra: Partial<ContextInput> = {}): ContextInput => ({ ...BASE, ...COLUMN_INPUTS[column], ...extra });

const columnContext = (column: Column, extra: Partial<ContextInput> = {}): BxelContext => deriveContext(columnInput(column, extra));

export { BASE, COLUMN_NAMES, columnContext, columnInput };
export type { Column };
