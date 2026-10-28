/* @layer renderer-app @kind component */
import { commandZone, useCommands } from '@drizztdourden08/brock-react';
import { Box, Text } from '@drizztdourden08/tessera';
import { useId, useMemo, useRef } from 'react';
import { ADD_TEXT } from '../../../add-frames/add-frames.constants';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { TIMELINE_KEY_COMMANDS } from '../../../keymap/timeline-key-commands.constants';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { timelineModel } from '../../../timeline/timeline-model';
import { useBoxSize } from '../behavior/useBoxSize';
import { useTimelineKeys } from '../behavior/useTimelineKeys';
import { useTimelineMenu } from '../behavior/useTimelineMenu';
import { COMPACT_WIDTH, SHORT_HEIGHT, TIMELINE_KEYS, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { FramePopover } from './FramePopover';
import { SelectionFooter } from './SelectionFooter';
import { TimelineBody } from './TimelineBody';
import { TimelineHeader } from './TimelineHeader';

const TimelineView = ({ focus }: FocusProps) => {
  const root = useRef<HTMLDivElement>(null);
  const hintId = useId();
  const { width, height } = useBoxSize(root);
  const selection = useTimelineStore((state) => state.selection);
  const tagId = useTimelineStore((state) => state.tagId);
  const onKeyDown = useTimelineKeys();
  useTimelineMenu();
  useCommands(TIMELINE_KEY_COMMANDS);
  const model = useMemo(() => timelineModel(focus, selection, tagId), [focus, selection, tagId]);
  const compact = width < COMPACT_WIDTH;
  return (
    <Box
      ref={root}
      role="group"
      aria-label={TIMELINE_TEXT.region}
      aria-describedby={hintId}
      aria-keyshortcuts={TIMELINE_KEYS}
      className="timeline"
      data-compact={compact ? 'yes' : 'no'}
      {...commandZone(COMMAND_ZONE.timeline)}
      onKeyDown={onKeyDown}
    >
      <TimelineHeader focus={focus} compact={compact} />
      {focus.readOnly && <Text variant="caption" tone="muted" className="timeline__banner">{TIMELINE_PANEL_TEXT.readOnlyBanner}</Text>}
      <TimelineBody focus={focus} model={model} width={width} />
      <SelectionFooter focus={focus} short={height < SHORT_HEIGHT} />
      <FramePopover focus={focus} container={root} />
      <Box id={hintId} className="visually-hidden">{`${TIMELINE_TEXT.playHint} ${TIMELINE_TEXT.moveHint} ${TIMELINE_TEXT.stripHint} ${ADD_TEXT.dropHint}`}</Box>
    </Box>
  );
};

export { TimelineView };
