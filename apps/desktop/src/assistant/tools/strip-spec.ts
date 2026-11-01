/* @layer renderer-app @kind logic */
import type { Sheet, Sprite } from '@bxel/document';
import type { PlanOf } from '@bxel/mcp';
import type { CutStripSpec } from '../../sheet-manager/compose.type';
import { stripStart } from '../../sheet-manager/strip-start';
import { definedOnly } from './defined-only';

const stripSpec = (args: PlanOf<'strip'>, target: Sprite | null, sheet: Sheet | null): CutStripSpec => {
  const start = stripStart(target, sheet);
  const cells = definedOnly({ by: args.by, columns: args.columns, rows: args.rows, cellWidth: args.cellWidth, cellHeight: args.cellHeight });
  return {
    ...start,
    ...definedOnly({ result: args.result, durationMs: args.durationMs, swap: args.swap }),
    strip: { ...start.strip, ...cells },
  };
};

export { stripSpec };
