/* @layer renderer-app @kind component */
import { useId, useMemo } from 'react';
import { commandZone } from '@drizztdourden08/brock-react';
import { Box, Disclosure, Divider, Flex, Text } from '@drizztdourden08/tessera';
import { ADD_TEXT } from '../../add-frames/add-frames.constants';
import { COMMAND_ZONE } from '../../keymap/command-zone.constants';
import { useAnimationFocus } from '../../hooks/useAnimationFocus';
import { useTimelineStore } from '../../stores/useTimelineStore';
import { ONION_TEXT } from '../../timeline/onion.constants';
import { spanTagOf } from '../../timeline/span-tag-of';
import { statusText } from '../../timeline/status-text';
import { tagById } from '../../timeline/tag-by-id';
import { TIMELINE_TEXT } from '../../timeline/timeline.constants';
import { timelineModel } from '../../timeline/timeline-model';
import { FRAME_ACTIONS, TIMELINE_KEYS, TIMELINE_PANEL_TEXT } from './TimelinePanel.constants';
import { useTimelineKeys } from './behavior/useTimelineKeys';
import { useTimelineMenu } from './behavior/useTimelineMenu';
import { ActionBar } from './sub-components/ActionBar';
import { AddFramesMenu } from './sub-components/AddFramesMenu';
import { DirectionPad } from './sub-components/DirectionPad';
import { EmptyTimeline } from './sub-components/EmptyTimeline';
import { FrameFields } from './sub-components/FrameFields';
import { FrameStrip } from './sub-components/FrameStrip';
import { OnionControls } from './sub-components/OnionControls';
import { OnionToggle } from './sub-components/OnionToggle';
import { TagEditor } from './sub-components/TagEditor';
import { TransformMenu } from './sub-components/TransformMenu';
import { TransportBar } from './sub-components/TransportBar';
import './TimelinePanel.css';

const TimelinePanel = () => {
  const focus = useAnimationFocus();
  const selection = useTimelineStore((state) => state.selection);
  const tagId = useTimelineStore((state) => state.tagId);
  const hintId = useId();
  const onKeyDown = useTimelineKeys();
  useTimelineMenu();
  const model = useMemo(() => (focus ? timelineModel(focus, selection, tagId) : null), [focus, selection, tagId]);
  if (!focus || !model) return <EmptyTimeline />;
  const { animation } = focus;
  const tag = tagById(animation, tagId);
  const span = spanTagOf(animation, tag);
  return (
    <Box
      role="group"
      aria-label={TIMELINE_TEXT.region}
      aria-describedby={hintId}
      aria-keyshortcuts={TIMELINE_KEYS}
      className="timeline"
      {...commandZone(COMMAND_ZONE.timeline)}
      onKeyDown={onKeyDown}
    >
      <Flex gap="md" align="center" wrap className="timeline__bar">
        <TransportBar focus={focus} />
        <Divider orientation="vertical" />
        <ActionBar label={TIMELINE_PANEL_TEXT.frames} actions={FRAME_ACTIONS} disabled={focus.readOnly} />
        <AddFramesMenu disabled={focus.readOnly} />
        <TransformMenu disabled={focus.readOnly} />
        <Divider orientation="vertical" />
        <OnionToggle />
        <Text variant="caption" tone="muted" role="status" aria-live="polite">{statusText(focus)}</Text>
      </Flex>
      {animation.directions !== 'none' && <DirectionPad focus={focus} />}
      <FrameFields focus={focus} />
      <Disclosure summary={TIMELINE_TEXT.count(animation.frames.length)} size="sm" defaultOpen>
        <FrameStrip focus={focus} model={model} />
        {tag?.kind === 'span' && <TagEditor key={tag.id} tag={tag} readOnly={focus.readOnly} />}
        {tag?.kind === 'mirror' && span && <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.tagMirror(tag.flip)}</Text>}
        <Disclosure summary={ONION_TEXT.toggle} size="sm">
          <OnionControls />
        </Disclosure>
      </Disclosure>
      <Box id={hintId} className="visually-hidden">{`${TIMELINE_TEXT.playHint} ${TIMELINE_TEXT.moveHint} ${TIMELINE_TEXT.stripHint} ${ADD_TEXT.dropHint}`}</Box>
    </Box>
  );
};

export { TimelinePanel };
