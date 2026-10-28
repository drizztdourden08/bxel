/* @layer renderer-app @kind component */
import { MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';
import type { AnimFrameId } from '@bxel/document';
import { Box, NumberInput, Text, Tooltip } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { formatDuration } from '../../../timeline/format-duration';
import { setDurationOf } from '../../../timeline/set-duration';
import { focusFirstField } from '../behavior/focus-field';
import { DURATION_STEP, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { DurationChipProps } from '../TimelinePanel.type';

const DurationChip = ({ id, durationMs, readOnly }: DurationChipProps) => {
  const units = useTimelineStore((state) => state.units);
  const [draft, setDraft] = useState<number | null>(null);
  const commit = (): void => {
    if (draft !== null && Number.isFinite(draft) && draft !== durationMs) setDurationOf(pickedWith(id), draft);
    setDraft(null);
  };
  if (draft !== null) {
    return (
      <Box ref={focusFirstField} className="frame-option__edit">
      <NumberInput
        size="sm"
        sizeToContent
        min={MIN_DURATION_MS}
        max={MAX_DURATION_MS}
        step={DURATION_STEP}
        value={draft}
        aria-label={TIMELINE_PANEL_TEXT.editDuration}
        onChange={setDraft}
        onBlur={commit}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === 'Enter') commit();
          if (event.key === 'Escape') setDraft(null);
        }}
      />
      </Box>
    );
  }
  return (
    <Tooltip content={readOnly ? `${durationMs} ms` : TIMELINE_PANEL_TEXT.editDuration} placement="top">
      <Text as="span" variant="caption" tone="muted" numeric className="frame-option__duration" onDoubleClick={readOnly ? undefined : () => setDraft(durationMs)}>
        {formatDuration(durationMs, units)}
      </Text>
    </Tooltip>
  );
};

const pickedWith = (id: AnimFrameId): readonly AnimFrameId[] => {
  const picked = useTimelineStore.getState().selection.frames;
  return picked.includes(id) && picked.length > 1 ? picked : [id];
};

export { DurationChip };
