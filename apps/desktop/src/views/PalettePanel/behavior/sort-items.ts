/* @layer renderer-app @kind logic */
import type { PaletteSortDirection } from '@bxel/palette';
import type { MenuItem } from '@drizztdourden08/tessera';
import { sortSwatches } from '../../../palette-panel/sort-swatches';
import { SORT_KEYS } from '../PalettePanel.constants';
import type { PanelModel } from '../PalettePanel.type';
import { reportOutcome } from './report-outcome';

const sortItems = (panel: PanelModel, direction: PaletteSortDirection): MenuItem[] =>
  SORT_KEYS.map(({ key, label }) => ({
    id: `sort-${direction}-${key}`,
    label,
    disabled: panel.lock.locked,
    onSelect: () => reportOutcome(sortSwatches(panel.target, key, direction, [...panel.selection.selected]), true),
  }));

export { sortItems };
