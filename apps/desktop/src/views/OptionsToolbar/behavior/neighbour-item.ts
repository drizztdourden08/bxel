/* @layer renderer-app @kind logic */
import type { Connectivity } from '@bxel/raster';
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { CONNECTIVITIES } from '../../../editor/tools.constants';
import { choose, hintChoice } from '../../../toolbar-items';
import { NEIGHBOUR_CHOICES, NEIGHBOUR_HINTS, NEIGHBOUR_ICONS, NEIGHBOUR_VALUES } from '../OptionsToolbar.constants';

const neighbourItem = (id: string, label: string, value: Connectivity, onChange: (value: Connectivity) => void): ToolbarItem => ({
  kind: 'group',
  id,
  label,
  value: NEIGHBOUR_CHOICES[value],
  choices: CONNECTIVITIES.map((each) => hintChoice(NEIGHBOUR_CHOICES[each], NEIGHBOUR_ICONS[each], NEIGHBOUR_HINTS[each])),
  onChange: choose(NEIGHBOUR_VALUES, (choice) => onChange(choice === NEIGHBOUR_CHOICES[8] ? 8 : 4)),
});

export { neighbourItem };
