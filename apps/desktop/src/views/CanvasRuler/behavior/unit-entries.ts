/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { RULER_UNIT_LABELS, RULER_UNIT_TEXT, RULER_UNITS } from '../../../ruler/ruler-unit.constants';
import { useRulerUnitStore } from '../../../stores/useRulerUnitStore';

const unitEntries = (): ContextMenuEntry => {
  const { unit, tile } = useRulerUnitStore.getState();
  return {
    label: RULER_UNIT_TEXT.menu,
    items: RULER_UNITS.map((each) => ({
      command: 'ruler.set_unit',
      label: RULER_UNIT_LABELS[each],
      args: { unit: each },
      kind: 'radio' as const,
      checked: each === unit,
      ...unless(each !== 'tiles' || tile >= 1, RULER_UNIT_TEXT.noTile),
    })),
  };
};

export { unitEntries };
