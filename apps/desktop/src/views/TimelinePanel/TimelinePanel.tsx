/* @layer renderer-app @kind component */
import { useId, useMemo } from 'react';
import { Box, Disclosure, Divider, EmptyState, Flex, Text } from '@drizztdourden08/tessera';
import { FOCUS_ZONE } from '../../editor/focus/focus-zone.constants';
import { useEditorTarget } from '../../hooks/useEditorTarget';
import { useTimelineStore } from '../../stores/useTimelineStore';
import { ONION_TEXT } from '../../timeline/onion.constants';
import { setDuration } from '../../timeline/set-duration';
import { statusText } from '../../timeline/status-text';
import { TIMELINE_TEXT } from '../../timeline/timeline.constants';
import { timelineModel } from '../../timeline/timeline-model';
import { CEL_ACTIONS, FRAME_ACTIONS, TIMELINE_KEYS, TIMELINE_PANEL_TEXT } from './TimelinePanel.constants';
import { useTimelineKeys } from './behavior/useTimelineKeys';
import { useTimelinePlayback } from './behavior/useTimelinePlayback';
import { ActionBar } from './sub-components/ActionBar';
import { DurationField } from './sub-components/DurationField';
import { OnionControls } from './sub-components/OnionControls';
import { OnionToggle } from './sub-components/OnionToggle';
import { TagEditor } from './sub-components/TagEditor';
import { TimelineGrid } from './sub-components/TimelineGrid';
import { TransportBar } from './sub-components/TransportBar';
import './TimelinePanel.css';

const TimelinePanel = () => {
  const target = useEditorTarget();
  const selection = useTimelineStore((state) => state.selection);
  const tagId = useTimelineStore((state) => state.tagId);
  const pingPong = useTimelineStore((state) => state.pingPong);
  const hintId = useId();
  const onKeyDown = useTimelineKeys();
  useTimelinePlayback();
  const model = useMemo(() => (target ? timelineModel(target, selection, tagId) : null), [target, selection, tagId]);
  if (!target || !model) return <EmptyState message={TIMELINE_TEXT.empty} />;
  const { sprite, frameId } = target;
  const tag = sprite.tags.find((each) => each.id === tagId);
  const duration = sprite.frames.find((frame) => frame.id === frameId)?.durationMs ?? 0;
  return (
    <Box
      role="group"
      aria-label={TIMELINE_TEXT.region}
      aria-describedby={hintId}
      aria-keyshortcuts={TIMELINE_KEYS}
      className="timeline"
      data-focus-zone={FOCUS_ZONE.timeline}
      onKeyDown={onKeyDown}
    >
      <Flex gap="md" align="center" wrap className="timeline__bar">
        <TransportBar />
        <Divider orientation="vertical" />
        <ActionBar label={TIMELINE_PANEL_TEXT.frames} actions={FRAME_ACTIONS} />
        <DurationField key={`${frameId}:${duration}`} value={duration} onCommit={setDuration} />
        <Divider orientation="vertical" />
        <ActionBar label={TIMELINE_PANEL_TEXT.cels} actions={CEL_ACTIONS} />
        <Divider orientation="vertical" />
        <OnionToggle />
        <Text variant="caption" tone="muted" role="status" aria-live="polite">{statusText(target, { pingPong, tagId })}</Text>
      </Flex>
      <Disclosure summary={TIMELINE_TEXT.count(sprite.frames.length, sprite.layers.length)} size="sm" defaultOpen>
        <TimelineGrid model={model} frameId={frameId} />
        {tag && <TagEditor tag={tag} />}
        <Disclosure summary={ONION_TEXT.toggle} size="sm">
          <OnionControls />
        </Disclosure>
      </Disclosure>
      <Box id={hintId} className="visually-hidden">{`${TIMELINE_TEXT.playHint} ${TIMELINE_TEXT.moveHint} ${TIMELINE_TEXT.pickHint} ${TIMELINE_TEXT.laneHint}`}</Box>
    </Box>
  );
};

export { TimelinePanel };
