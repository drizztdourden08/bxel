/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import { colourGroups } from '../behavior/colour-groups';
import { colourName } from '../behavior/colour-name';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerColoursProps } from '../LayerStack.type';

const LayerColours = ({ value, label, onPick }: LayerColoursProps) => (
  <DropdownMenu
    trigger={{ label: `${label}: ${value === null ? LAYER_STACK_TEXT.noTag : colourName(value)}`, icon: 'tag', iconOnly: true }}
    variant="secondary"
    size="sm"
    label={label}
    groups={colourGroups(value, onPick)}
  />
);

export { LayerColours };
