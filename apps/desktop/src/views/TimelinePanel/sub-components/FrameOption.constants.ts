/* @layer renderer-app @kind constants */
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';

const DROP_TEXT = { move: TIMELINE_PANEL_TEXT.dropTo, copy: TIMELINE_PANEL_TEXT.dropCopy, link: TIMELINE_PANEL_TEXT.dropLink } as const;

export { DROP_TEXT };
