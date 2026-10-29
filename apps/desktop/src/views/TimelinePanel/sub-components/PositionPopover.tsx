/* @layer renderer-app @kind component */
import { Box, Button, Flex, NumberInput } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { moveFramesTo } from '../../../timeline/move-frames-to';
import { focusFirstField } from '../behavior/focus-field';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';

const PositionPopover = ({ focus }: FocusProps) => {
  const close = useTimelineStore((state) => state.setPopover);
  const total = focus.animation.frames.length;
  const [position, setPosition] = useState(focus.animation.frames.findIndex((frame) => frame.id === focus.frame.id) + 1);
  const move = (): void => {
    if (Number.isFinite(position) && moveFramesTo(Math.min(Math.max(Math.round(position), 1), total) - 1)) close(null);
  };
  return (
    <Box ref={focusFirstField}>
    <Flex gap="xs" align="center" role="group" aria-label={TIMELINE_PANEL_TEXT.positionLabel}>
      <NumberInput
        size="sm"
        sizeToContent
        min={1}
        max={total}
        step={1}
        value={position}
        aria-label={TIMELINE_PANEL_TEXT.positionLabel}
        onChange={setPosition}
        onKeyDown={(event) => {
          if (event.key === 'Enter') move();
        }}
      />
      <Button size="sm" variant="primary" onClick={move}>{TIMELINE_PANEL_TEXT.move}</Button>
    </Flex>
    </Box>
  );
};

export { PositionPopover };
