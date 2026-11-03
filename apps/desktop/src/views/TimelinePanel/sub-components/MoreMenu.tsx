/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { moreGroups } from '../behavior/more-groups';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { CompactProps } from '../TimelinePanel.type';

const MoreMenu = ({ focus, compact }: CompactProps) => {
  useTimelineStore((state) => state.timeMode);
  useTimelineStore((state) => state.zoom);
  useTimelineStore((state) => state.fit);
  useTimelineStore((state) => state.onion.on);
  useTimelineStore((state) => state.tagId);
  return (
    <DropdownMenu
      size="xs"
      variant="secondary"
      align="end"
      label={TIMELINE_PANEL_TEXT.more}
      trigger={{ label: TIMELINE_PANEL_TEXT.more, icon: 'ellipsis', iconOnly: true }}
      groups={moreGroups(focus, compact)}
    />
  );
};

export { MoreMenu };
