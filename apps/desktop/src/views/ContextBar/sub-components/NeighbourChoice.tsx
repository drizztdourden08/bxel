/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera';
import { CONNECTIVITIES } from '../../../editor/tools.constants';
import { segmentOption } from '../../ActionHint';
import { NEIGHBOUR_CHOICES, NEIGHBOUR_HINTS } from '../ContextBar.constants';
import type { NeighbourChoiceProps } from '../ContextBar.type';

const NeighbourChoice = ({ label, value, onChange }: NeighbourChoiceProps) => (
  <SegmentedControl
    size="sm"
    aria-label={label}
    value={NEIGHBOUR_CHOICES[value]}
    options={CONNECTIVITIES.map((each) => segmentOption({ value: NEIGHBOUR_CHOICES[each], label: NEIGHBOUR_CHOICES[each], hint: NEIGHBOUR_HINTS[each] }))}
    onChange={(choice) => onChange(choice === NEIGHBOUR_CHOICES[8] ? 8 : 4)}
  />
);

export { NeighbourChoice };
