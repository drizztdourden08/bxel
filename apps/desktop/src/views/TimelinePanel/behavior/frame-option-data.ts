/* @layer renderer-app @kind logic */
import type { FrameCell } from '../../../timeline/timeline.type';
import { yesNo } from './yes-no';

const frameOptionData = (cell: FrameCell): Record<string, string | undefined> => ({
  'data-frame-id': cell.id,
  'data-current': yesNo(cell.current),
  'data-selected': yesNo(cell.selected),
  'data-empty': cell.badges.includes('empty') ? 'yes' : undefined,
  'data-link-prev': cell.linkedTo !== null ? 'yes' : undefined,
  'data-link-next': cell.linkedNext ? 'yes' : undefined,
});

export { frameOptionData };
