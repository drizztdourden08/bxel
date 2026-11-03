/* @layer renderer-app @kind logic */
import type { VirtualListMove } from '@drizztdourden08/tessera';
import { dragModeOf } from '../../../timeline/drag-mode-of';
import { DROP_TEXT } from './drop-label.constants';

const dropLabel = (position: number, modifier: VirtualListMove['modifier']): string => DROP_TEXT[dragModeOf(modifier)](position);

export { dropLabel };
