/* @layer renderer-app @kind hook */
import { CELL_STEPS } from '../../../canvas-look/canvas-look.constants';
import { isBitSet } from '../../../canvas-look/is-bit-set';
import { stepCell } from '../../../canvas-look/step-cell';
import type { PatternKeys, PatternKeysArgs } from './pattern-grid.type';

const usePatternKeys = ({ bits, cursor, apply, setCursor }: PatternKeysArgs): PatternKeys => ({
  onKeyDown: (event) => {
    const at = cursor ?? 0;
    if (event.key in CELL_STEPS) {
      event.preventDefault();
      setCursor(stepCell(at, event.key));
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      apply(at, !isBitSet(bits.current, at));
    }
  },
});

export { usePatternKeys };
