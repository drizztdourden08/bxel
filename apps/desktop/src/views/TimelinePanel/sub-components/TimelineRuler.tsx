/* @layer renderer-app @kind component */
import { Box, ScrubRuler } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { changeOnion } from '../behavior/change-onion';
import { onionMarkers } from '../behavior/onion-markers';
import { rulerBand } from '../behavior/ruler-band';
import { scrubTo } from '../behavior/scrub-to';
import { setRulerBand } from '../behavior/set-ruler-band';
import { tickLabel } from '../behavior/tick-label';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { RulerProps } from '../TimelinePanel.type';

const TimelineRuler = ({ focus, layout }: RulerProps) => {
  const units = useTimelineStore((state) => state.units);
  const timeMode = useTimelineStore((state) => state.timeMode);
  const loopRange = useTimelineStore((state) => state.loopRange);
  const onion = useTimelineStore((state) => state.onion);
  const { frames } = focus.animation;
  const current = frames.findIndex((frame) => frame.id === focus.frame.id);
  return (
    <Box className="ruler" style={{ inlineSize: layout.total }} data-ruler data-lefts={layout.lefts.join(',')}>
      <ScrubRuler
        cells={layout}
        value={Math.max(0, current)}
        label={TIMELINE_PANEL_TEXT.ruler}
        valueText={(index, count) => TIMELINE_PANEL_TEXT.rulerValue(index + 1, count)}
        tickLabel={(index) => tickLabel(frames, index, timeMode, units)}
        markers={onionMarkers(onion, current, frames.length - 1)}
        band={rulerBand(frames, loopRange)}
        bandLabel={({ from, to }) => TIMELINE_PANEL_TEXT.loopRange(from + 1, to + 1)}
        onChange={(index) => scrubTo(frames, index)}
        onMarkerChange={(id, index) => changeOnion(id, index, current)}
        onBandChange={(band) => setRulerBand(frames, band)}
      />
    </Box>
  );
};

export { TimelineRuler };
