/* @layer core @kind logic */
import { addWarning } from '@bxel/document';
import type { Draft } from '@bxel/document';
import { WARNING_CODE } from './palette-warning.constants';

const warnDuplicates = (draft: Draft, bankName: string, colors: readonly string[], start = 0): void => {
  for (const rgb of colors.filter((value, at) => at >= start && colors.indexOf(value) !== at)) {
    addWarning(draft, WARNING_CODE.DUPLICATE_COLOR, `${rgb} appears more than once in bank "${bankName}".`);
  }
};

export { warnDuplicates };
