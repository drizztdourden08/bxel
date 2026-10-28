/* @layer renderer-app @kind component */
import { Box, Icon, Pressable, Text } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { formatDuration } from '../../../timeline/format-duration';
import { useScrub } from '../behavior/useScrub';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { RulerProps } from '../TimelinePanel.type';
import { OnionHandles } from './OnionHandles';

const TICK_MIN = 28;

const TimelineRuler = ({ focus, layout }: RulerProps) => {
  const units = useTimelineStore((state) => state.units);
  const timeMode = useTimelineStore((state) => state.timeMode);
  const loopRange = useTimelineStore((state) => state.loopRange);
  const [draft, setDraft] = useState<{ from: number; to: number } | null>(null);
  const scrub = useScrub(focus, layout, setDraft);
  const { frames } = focus.animation;
  const current = frames.findIndex((frame) => frame.id === focus.frame.id);
  const stride = Math.max(1, Math.ceil(TICK_MIN / Math.max(1, layout.widths[0] ?? TICK_MIN)));
  const committed = loopRange ? { from: frames.findIndex((frame) => frame.id === loopRange.from), to: frames.findIndex((frame) => frame.id === loopRange.to) } : null;
  const band = draft ?? (committed && committed.from >= 0 && committed.to >= 0 ? committed : null);
  const start = band ? Math.min(band.from, band.to) : 0;
  const end = band ? Math.max(band.from, band.to) : 0;
  let elapsed = 0;
  return (
    <Box className="ruler" style={{ inlineSize: layout.total }} data-ruler>
      <Box
        role="slider"
        tabIndex={0}
        className="ruler__scrub"
        aria-label={TIMELINE_PANEL_TEXT.ruler}
        aria-valuemin={1}
        aria-valuemax={frames.length}
        aria-valuenow={current + 1}
        aria-valuetext={TIMELINE_PANEL_TEXT.rulerValue(current + 1, frames.length)}
        {...scrub}
      >
        {frames.map((frame, index) => {
          const at = elapsed;
          elapsed += frame.durationMs;
          const label = timeMode ? formatDuration(at, units) : String(index + 1);
          return (
            <Text
              key={frame.id}
              as="span"
              variant="caption"
              numeric
              className="ruler__tick"
              style={{ insetInlineStart: layout.lefts[index], inlineSize: layout.widths[index] }}
              data-current={index === current ? 'yes' : 'no'}
              aria-hidden="true"
            >
              {timeMode || index % stride === 0 ? label : ''}
            </Text>
          );
        })}
        {band && (
          <Box
            className="ruler__loop"
            aria-hidden="true"
            style={{ insetInlineStart: layout.lefts[start], inlineSize: (layout.lefts[end] ?? 0) + (layout.widths[end] ?? 0) - (layout.lefts[start] ?? 0) }}
          />
        )}
      </Box>
      <OnionHandles focus={focus} layout={layout} current={current} />
      {committed && !draft && committed.from >= 0 && committed.to >= 0 && (
        <Pressable
          className="ruler__clear"
          aria-label={TIMELINE_PANEL_TEXT.clearLoop}
          title={TIMELINE_PANEL_TEXT.loopRange(Math.min(committed.from, committed.to) + 1, Math.max(committed.from, committed.to) + 1)}
          style={{ insetInlineStart: (layout.lefts[end] ?? 0) + (layout.widths[end] ?? 0) - 16 }}
          onClick={() => useTimelineStore.getState().setLoopRange(null)}
        >
          <Icon name="x" size={10} aria-hidden="true" />
        </Pressable>
      )}
    </Box>
  );
};

export { TimelineRuler };
