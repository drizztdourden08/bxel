/* @layer renderer-app @kind component */
import { Box, Icon, Tooltip } from '@drizztdourden08/tessera';
import type { FrameCell } from '../../../timeline/timeline.type';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';

const FrameBadges = ({ cell }: { cell: FrameCell }) => {
  const shared = cell.badges.includes('shared');
  const clip = cell.badges.includes('clip');
  const empty = cell.badges.includes('empty');
  if (!shared && !clip && !empty) return null;
  return (
    <Box className="frame-option__badges" data-frame-badges>
      {shared && (
        <Tooltip content={cell.linkedTo === null ? TIMELINE_PANEL_TEXT.shared : TIMELINE_PANEL_TEXT.linkedTo(cell.linkedTo)} placement="top">
          <Icon name="link" size={12} aria-hidden="true" />
        </Tooltip>
      )}
      {clip && (
        <Tooltip content={TIMELINE_PANEL_TEXT.clip} placement="top">
          <Icon name="pixel-select-rect" size={12} aria-hidden="true" />
        </Tooltip>
      )}
      {empty && (
        <Tooltip content={TIMELINE_PANEL_TEXT.empty} placement="top">
          <Icon name="circle" size={12} aria-hidden="true" />
        </Tooltip>
      )}
    </Box>
  );
};

export { FrameBadges };
