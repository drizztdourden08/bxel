/* @layer renderer-app @kind component */
import { ButtonGroup, Flex, Icon, IconButton, Select, Text, Tooltip } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { selectTag } from '../../../timeline/select-tag';
import { stepFrame } from '../../../timeline/step-frame';
import { tagOptions } from '../../../timeline/tag-options';
import { totalsText } from '../../../timeline/totals-text';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';

const TransportBar = ({ focus }: FocusProps) => {
  const playing = useTimelineStore((state) => state.playing);
  const loop = useTimelineStore((state) => state.loop);
  const tagId = useTimelineStore((state) => state.tagId);
  const togglePlay = useTimelineStore((state) => state.togglePlay);
  const setLoop = useTimelineStore((state) => state.setLoop);
  const playName = playing ? TIMELINE_PANEL_TEXT.pause : TIMELINE_PANEL_TEXT.play;
  const known = tagId !== null && focus.animation.tags.some((tag) => tag.id === tagId);
  return (
    <Flex gap="sm" align="center" wrap role="group" aria-label={TIMELINE_PANEL_TEXT.transport}>
      <ButtonGroup aria-label={TIMELINE_PANEL_TEXT.transport}>
        <Tooltip content={`${TIMELINE_PANEL_TEXT.previous} (,)`} placement="top">
          <IconButton label={TIMELINE_PANEL_TEXT.previous} size="sm" onClick={() => stepFrame(-1)}>
            <Icon name="pixel-frame-prev" />
          </IconButton>
        </Tooltip>
        <Tooltip content={playName} placement="top">
          <IconButton label={playName} size="sm" active={playing} aria-pressed={playing} onClick={togglePlay}>
            <Icon name={playing ? 'pixel-pause' : 'pixel-play'} />
          </IconButton>
        </Tooltip>
        <Tooltip content={`${TIMELINE_PANEL_TEXT.next} (.)`} placement="top">
          <IconButton label={TIMELINE_PANEL_TEXT.next} size="sm" onClick={() => stepFrame(1)}>
            <Icon name="pixel-frame-next" />
          </IconButton>
        </Tooltip>
        <Tooltip content={TIMELINE_PANEL_TEXT.loop} placement="top">
          <IconButton label={TIMELINE_PANEL_TEXT.loop} size="sm" active={loop} aria-pressed={loop} onClick={() => setLoop(!loop)}>
            <Icon name="pixel-loop" />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
      <Select
        size="sm"
        aria-label={TIMELINE_PANEL_TEXT.tagPick}
        options={tagOptions(focus.animation)}
        value={known ? tagId : ''}
        onChange={(value) => (value === '' ? useTimelineStore.getState().selectTag(null) : selectTag(value as NonNullable<typeof tagId>))}
      />
      <Text variant="caption" tone="muted" aria-live="polite">{totalsText(focus, known ? tagId : null)}</Text>
    </Flex>
  );
};

export { TransportBar };
