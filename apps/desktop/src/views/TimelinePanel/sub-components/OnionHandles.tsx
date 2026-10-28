/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import type { ReactElement } from 'react';
import { ONION_LIMITS } from '../../../stores/timeline-store.constants';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { handleLeft } from '../behavior/handle-left';
import { onionDrag } from '../behavior/onion-drag';
import { onionKey } from '../behavior/onion-key';
import { spanStyle } from '../behavior/span-style';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { OnionHandlesProps } from '../TimelinePanel.type';
import type { Side } from './OnionHandles.type';

const OnionHandles = ({ focus, layout, current }: OnionHandlesProps) => {
  const onion = useTimelineStore((state) => state.onion);
  if (!onion.on || current < 0) return null;
  const last = focus.animation.frames.length - 1;
  const handle = (side: Side): ReactElement => {
    const count = onion[side];
    const index = Math.min(last, Math.max(0, side === 'before' ? current - count : current + count));
    return (
      <Box
        key={side}
        role="slider"
        tabIndex={0}
        className="ruler__onion"
        data-side={side}
        aria-label={side === 'before' ? TIMELINE_PANEL_TEXT.onionBefore(count) : TIMELINE_PANEL_TEXT.onionAfter(count)}
        aria-valuemin={ONION_LIMITS.frames.min}
        aria-valuemax={ONION_LIMITS.frames.max}
        aria-valuenow={count}
        style={{ insetInlineStart: handleLeft(side, layout, index) }}
        onPointerDown={(event) => {
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={onionDrag(side, layout, current, last)}
        onKeyDown={onionKey(side)}
      />
    );
  };
  return (
    <>
      <Box
        className="ruler__onion-band"
        aria-hidden="true"
        style={spanStyle(layout, Math.max(0, current - onion.before), Math.min(last, current + onion.after))}
      />
      {handle('before')}
      {handle('after')}
    </>
  );
};

export { OnionHandles };
