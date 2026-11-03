/* @layer renderer-app @kind hook */
import type { VirtualListSelection } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { selectFrameIds } from '../../../timeline/select-frame-ids';
import type { AnimationFocus } from '../../../timeline/timeline.type';

const useFrameSelection = (focus: AnimationFocus): VirtualListSelection => {
  const picked = useTimelineStore((state) => state.selection.frames);
  const { frames } = focus.animation;
  const current = focus.frame.id;
  const selected = useMemo<ReadonlySet<string>>(() => new Set(picked), [picked]);
  return useMemo<VirtualListSelection>(
    () => ({
      selected,
      onChange: (keys) => {
        const ids = frames.map((frame) => frame.id).filter((id) => keys.has(id));
        if (ids.length === 0) selectFrameIds([current], current);
        else selectFrameIds(ids, ids.includes(current) ? current : ids.at(-1));
      },
    }),
    [selected, frames, current],
  );
};

export { useFrameSelection };
