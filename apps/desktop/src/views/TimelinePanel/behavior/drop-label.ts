/* @layer renderer-app @kind logic */
import type { VirtualListMove } from '@drizztdourden08/tessera';
import { dragModeOf } from '../../../timeline/drag-mode-of';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';

const DROP_TEXT = { move: TIMELINE_PANEL_TEXT.dropTo, copy: TIMELINE_PANEL_TEXT.dropCopy, link: TIMELINE_PANEL_TEXT.dropLink } as const;

const dropLabel = (position: number, modifier: VirtualListMove['modifier']): string => DROP_TEXT[dragModeOf(modifier)](position);

export { dropLabel };
