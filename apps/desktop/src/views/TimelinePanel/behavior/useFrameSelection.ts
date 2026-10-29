/* @layer renderer-app @kind hook */
import type { AnimFrameId } from '@bxel/document';
import { useSelectionModel } from '@drizztdourden08/tessera';
import type { SelectionModel } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { goToFrame } from '../../../timeline/go-to-frame';
import { selectFrameIds } from '../../../timeline/select-frame-ids';
import type { AnimationFocus } from '../../../timeline/timeline.type';
import { zoneHandlesKey } from './zone-handles-key';

const useFrameSelection = (focus: AnimationFocus): SelectionModel => {
  const picked = useTimelineStore((state) => state.selection.frames);
  const order = useMemo(() => focus.animation.frames.map((frame) => frame.id), [focus.animation.frames]);
  const selected = useMemo<ReadonlySet<string>>(() => new Set(picked), [picked]);
  const current = focus.frame.id;
  const model = useSelectionModel({
    order,
    selected,
    onPick: (key) => goToFrame(key as AnimFrameId),
    onChange: (keys) => {
      const ids = order.filter((id) => keys.has(id));
      if (ids.length === 0) selectFrameIds([current], current);
      else selectFrameIds(ids, ids.includes(current) ? current : ids.at(-1));
    },
  });
  return useMemo<SelectionModel>(
    () => ({
      ...model,
      onKeyDown: (event, key) => {
        if (!zoneHandlesKey(event)) model.onKeyDown(event, key);
      },
    }),
    [model],
  );
};

export { useFrameSelection };
