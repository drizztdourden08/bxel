/* @layer renderer-app @kind logic */
import { useTimelineStore } from '../../stores/useTimelineStore';
import { currentFocus } from '../../timeline/current-focus';
import { currentSelection } from '../../timeline/current-selection';
import type { Sees } from './view-snapshot.type';

const rangeOf = () => {
  const { rangePicked, loopRange, tagId } = useTimelineStore.getState();
  if (rangePicked) return { kind: 'picked' as const };
  if (loopRange) return { kind: 'loop' as const, from: loopRange.from, to: loopRange.to };
  if (tagId !== null) return { kind: 'tag' as const, tagId };
  return { kind: 'whole' as const };
};

const timelineOf = (sees: Sees) => {
  const found = currentFocus();
  const focus = found && sees(found.documentId) ? found : null;
  const timeline = useTimelineStore.getState();
  return {
    animationId: focus ? focus.animation.id : null,
    frameId: focus ? focus.frame.id : null,
    pickedFrameIds: focus ? [...currentSelection(focus)] : [],
    range: rangeOf(),
    playing: timeline.playing,
    playMode: timeline.playMode,
    speed: timeline.speed,
    zoom: timeline.fit ? ('fit' as const) : timeline.zoom,
    timeMode: timeline.timeMode,
    units: timeline.units,
    onion: { ...timeline.onion },
  };
};

export { timelineOf };
