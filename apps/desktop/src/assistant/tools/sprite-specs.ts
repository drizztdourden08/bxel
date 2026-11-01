/* @layer renderer-app @kind logic */
import type { PlanOf } from '@bxel/mcp';
import type { Sheet, Sprite } from '@bxel/document';
import { SLICE_START } from '../../sheet-manager/compose.constants';
import type { CutStripSpec, SliceSpec } from '../../sheet-manager/compose.type';
import { COPY_TEXT } from '../../sheet-manager/copy-text.constants';
import { DEFAULT_PATTERN, FIRST_NUMBER } from '../../sheet-manager/manager.constants';
import type { RenameSpec } from '../../sheet-manager/manager.type';
import { stripStart } from '../../sheet-manager/strip-start';
import { definedOnly } from './defined-only';

const renameSpec = (args: PlanOf<'rename'>, copy: boolean): RenameSpec => ({
  pattern: copy ? `{name}${COPY_TEXT.suffix}` : DEFAULT_PATTERN,
  find: '',
  replace: '',
  start: FIRST_NUMBER,
  ...definedOnly({ pattern: args.pattern, find: args.find, replace: args.replace, start: args.start }),
});

const sliceSpec = (args: PlanOf<'slice'>): SliceSpec => {
  const { sprites: _sprites, ...rest } = args;
  return { ...SLICE_START, ...definedOnly(rest) };
};

const stripSpec = (args: PlanOf<'strip'>, target: Sprite | null, sheet: Sheet | null): CutStripSpec => {
  const start = stripStart(target, sheet);
  const cells = definedOnly({ by: args.by, columns: args.columns, rows: args.rows, cellWidth: args.cellWidth, cellHeight: args.cellHeight });
  return {
    ...start,
    ...definedOnly({ result: args.result, durationMs: args.durationMs, swap: args.swap }),
    strip: { ...start.strip, ...cells },
  };
};

export { renameSpec, sliceSpec, stripSpec };
