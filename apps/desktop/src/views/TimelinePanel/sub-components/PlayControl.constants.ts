/* @layer renderer-app @kind constants */
import type { PlayMode } from '../../../stores/timeline-store.type';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';

const MODES: readonly { id: PlayMode; label: string }[] = [
  { id: 'loop', label: TIMELINE_PANEL_TEXT.loop },
  { id: 'once', label: TIMELINE_PANEL_TEXT.once },
  { id: 'pingpong', label: TIMELINE_PANEL_TEXT.pingpong },
];

export { MODES };
