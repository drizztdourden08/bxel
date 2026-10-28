/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import type { PointerEvent, ReactElement } from 'react';
import { ONION_LIMITS } from '../../../stores/timeline-store.constants';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { indexAtX } from '../../../timeline/index-at-x';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { OnionHandlesProps } from '../TimelinePanel.type';

type Side = 'before' | 'after';

const clamp = (value: number): number => Math.min(ONION_LIMITS.frames.max, Math.max(ONION_LIMITS.frames.min, value));

const OnionHandles = ({ focus, layout, current }: OnionHandlesProps) => {
  const onion = useTimelineStore((state) => state.onion);
  const setOnion = useTimelineStore((state) => state.setOnion);
  if (!onion.on || current < 0) return null;
  const last = focus.animation.frames.length - 1;
  const drag = (side: Side) => (event: PointerEvent<HTMLElement>): void => {
    if (event.buttons !== 1) return;
    const box = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!box) return;
    const index = Math.min(last, Math.max(0, indexAtX(layout, event.clientX - box.left)));
    setOnion(side === 'before' ? { before: clamp(current - index) } : { after: clamp(index - current) });
  };
  const handle = (side: Side): ReactElement | null => {
    const count = side === 'before' ? onion.before : onion.after;
    const target = side === 'before' ? current - count : current + count;
    const index = Math.min(last, Math.max(0, target));
    const left = side === 'before' ? (layout.lefts[index] ?? 0) : (layout.lefts[index] ?? 0) + (layout.widths[index] ?? 0);
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
        style={{ insetInlineStart: left }}
        onPointerDown={(event) => {
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={drag(side)}
        onKeyDown={(event) => {
          const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
          if (step === 0) return;
          event.preventDefault();
          event.stopPropagation();
          const delta = side === 'before' ? -step : step;
          setOnion(side === 'before' ? { before: clamp(onion.before + delta) } : { after: clamp(onion.after + delta) });
        }}
      />
    );
  };
  return (
    <>
      <Box
        className="ruler__onion-band"
        aria-hidden="true"
        style={{
          insetInlineStart: layout.lefts[Math.max(0, current - onion.before)],
          inlineSize:
            (layout.lefts[Math.min(last, current + onion.after)] ?? 0) + (layout.widths[Math.min(last, current + onion.after)] ?? 0) - (layout.lefts[Math.max(0, current - onion.before)] ?? 0),
        }}
      />
      {handle('before')}
      {handle('after')}
    </>
  );
};

export { OnionHandles };
