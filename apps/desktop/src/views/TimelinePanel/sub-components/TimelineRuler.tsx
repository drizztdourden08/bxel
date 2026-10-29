/* @layer renderer-app @kind component */
import { Box, Icon, Pressable, Text } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { loopBand } from '../behavior/loop-band';
import type { LoopSpan } from '../behavior/loop-band.type';
import { spanStyle } from '../behavior/span-style';
import { tickLabel } from '../behavior/tick-label';
import { useScrub } from '../behavior/useScrub';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { RulerProps } from '../TimelinePanel.type';
import { OnionHandles } from './OnionHandles';
import { TICK_MIN } from './TimelineRuler.constants';

const TimelineRuler = ({ focus, layout }: RulerProps) => {
  const units = useTimelineStore((state) => state.units);
  const timeMode = useTimelineStore((state) => state.timeMode);
  const loopRange = useTimelineStore((state) => state.loopRange);
  const [draft, setDraft] = useState<LoopSpan | null>(null);
  const scrub = useScrub(focus, layout, setDraft);
  const { frames } = focus.animation;
  const current = frames.findIndex((frame) => frame.id === focus.frame.id);
  const stride = Math.max(1, Math.ceil(TICK_MIN / Math.max(1, layout.widths[0] ?? TICK_MIN)));
  const { valid, band, start, end } = loopBand(frames, loopRange, draft);
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
          const label = tickLabel(frames, index, timeMode, units);
          return (
            <Text
              key={frame.id}
              as="span"
              variant="caption"
              numeric
              className="ruler__tick"
              style={{ insetInlineStart: layout.lefts[index], inlineSize: layout.widths[index] }}
              data-current={index === current ? 'yes' : 'no'}
              data-tick-frame={frame.id}
              aria-hidden="true"
            >
              {timeMode || index % stride === 0 ? label : ''}
            </Text>
          );
        })}
        {band && <Box className="ruler__loop" aria-hidden="true" style={spanStyle(layout, start, end)} />}
      </Box>
      <OnionHandles focus={focus} layout={layout} current={current} />
      {valid && !draft && (
        <Pressable
          className="ruler__clear"
          aria-label={TIMELINE_PANEL_TEXT.clearLoop}
          title={TIMELINE_PANEL_TEXT.loopRange(Math.min(valid.from, valid.to) + 1, Math.max(valid.from, valid.to) + 1)}
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
