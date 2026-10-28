/* @layer renderer-app @kind component */
import { Flex, SearchInput } from '@drizztdourden08/tessera';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerFilterProps } from '../LayerStack.type';
import { LayerColours } from './LayerColours';

const LayerFilter = ({ text, colour, onText, onColour }: LayerFilterProps) => (
  <Flex direction="column" gap="xs">
    <SearchInput size="sm" value={text} placeholder={LAYER_STACK_TEXT.filterPlaceholder} aria-label={LAYER_STACK_TEXT.filter} onChange={onText} />
    <LayerColours value={colour} label={LAYER_STACK_TEXT.filterColour} onPick={onColour} />
  </Flex>
);

export { LayerFilter };
