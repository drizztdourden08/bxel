/* @layer renderer-app @kind component */
import { animFramePivot, MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';
import { Flex, Text } from '@drizztdourden08/tessera';
import { setOffset } from '../../../timeline/nudge-offset';
import { setDuration } from '../../../timeline/set-duration';
import { setPivot } from '../../../timeline/set-pivot';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { DURATION_STEP, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { NumberField } from './NumberField';

const OFFSET_LIMIT = 4096;

const FrameFields = ({ focus }: FocusProps) => {
  const { frame, animation, artwork, readOnly } = focus;
  const placed = frame.spriteId !== null && !readOnly;
  const pivot = animFramePivot(artwork, animation, frame);
  return (
    <Flex gap="md" align="center" wrap role="group" aria-label={TIMELINE_TEXT.frameGroup}>
      <Flex gap="xs" align="center">
        <NumberField
          key={`${frame.id}:duration:${frame.durationMs}`}
          label={TIMELINE_TEXT.duration}
          value={frame.durationMs}
          min={MIN_DURATION_MS}
          max={MAX_DURATION_MS}
          step={DURATION_STEP}
          disabled={readOnly}
          onCommit={setDuration}
        />
        <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.durationUnit}</Text>
      </Flex>
      <Flex gap="xs" align="center">
        <NumberField
          key={`${frame.id}:x:${frame.offset.x}`}
          label={TIMELINE_TEXT.offsetX}
          value={frame.offset.x}
          min={-OFFSET_LIMIT}
          max={OFFSET_LIMIT}
          step={1}
          disabled={!placed}
          onCommit={(value) => setOffset(Math.round(value), frame.offset.y)}
        />
        <NumberField
          key={`${frame.id}:y:${frame.offset.y}`}
          label={TIMELINE_TEXT.offsetY}
          value={frame.offset.y}
          min={-OFFSET_LIMIT}
          max={OFFSET_LIMIT}
          step={1}
          disabled={!placed}
          onCommit={(value) => setOffset(frame.offset.x, Math.round(value))}
        />
        <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.pixelUnit}</Text>
      </Flex>
      <Flex gap="xs" align="center">
        <NumberField
          key={`${frame.id}:px:${pivot.x2}`}
          label={TIMELINE_TEXT.pivotX}
          value={pivot.x2 / 2}
          min={0}
          max={OFFSET_LIMIT}
          step={0.5}
          disabled={!placed}
          onCommit={(value) => setPivot(Math.round(value * 2), null)}
        />
        <NumberField
          key={`${frame.id}:py:${pivot.y2}`}
          label={TIMELINE_TEXT.pivotY}
          value={pivot.y2 / 2}
          min={0}
          max={OFFSET_LIMIT}
          step={0.5}
          disabled={!placed}
          onCommit={(value) => setPivot(null, Math.round(value * 2))}
        />
        <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.pixelUnit}</Text>
      </Flex>
    </Flex>
  );
};

export { FrameFields };
