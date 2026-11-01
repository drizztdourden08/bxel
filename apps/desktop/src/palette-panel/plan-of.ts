/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { hexesOf } from './hexes-of';
import { SHEET_TEXT } from './palette-panel.constants';
import type { SheetPlan } from './palette-panel.type';
import type { RecolourChange } from './recolour-plan.type';

const planOf = (bank: PaletteBank, indices: readonly number[], change: RecolourChange): SheetPlan => ({
  title: change.title,
  note: change.note,
  gone: [],
  before: hexesOf(bank, indices),
  after: change.after,
  steps: change.steps,
  label: change.label,
  done: change.done,
  apply: SHEET_TEXT.recolour(change.steps.length),
});

export { planOf };
