/* @layer renderer-app @kind component */
import { Button, Flex, Icon, IconButton, Tooltip } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { deleteTag } from '../../../timeline/delete-tag';
import { setTagRange } from '../../../timeline/set-tag-range';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { TagPartProps } from '../TimelinePanel.type';
import { TagColours } from './TagColours';

const TagActions = ({ tag, readOnly }: TagPartProps) => (
  <Flex gap="sm" align="center" wrap>
    <TagColours tag={tag} readOnly={readOnly} />
    <Button size="sm" variant="secondary" disabled={readOnly} onClick={() => setTagRange(tag.id)}>
      {TIMELINE_PANEL_TEXT.tagRange}
    </Button>
    <Tooltip content={TIMELINE_PANEL_TEXT.tagDelete} placement="top">
      <IconButton
        label={TIMELINE_PANEL_TEXT.tagDelete}
        size="sm"
        disabled={readOnly}
        onClick={() => {
          useTimelineStore.getState().setPopover(null);
          deleteTag(tag.id);
        }}
      >
        <Icon name="pixel-frame-delete" />
      </IconButton>
    </Tooltip>
  </Flex>
);

export { TagActions };
