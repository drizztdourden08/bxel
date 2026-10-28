/* @layer renderer-app @kind component */
import { Button, EmptyState } from '@drizztdourden08/tessera';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerNoMatchProps } from '../LayerStack.type';

const LayerNoMatch = ({ onClear }: LayerNoMatchProps) => (
  <EmptyState
    size="sm"
    message={LAYER_STACK_TEXT.noMatch}
    action={<Button size="sm" variant="secondary" onClick={onClear}>{LAYER_STACK_TEXT.clearFilter}</Button>}
  />
);

export { LayerNoMatch };
