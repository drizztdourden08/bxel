/* @layer renderer-app @kind component */
import { Select } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { rangeOptions } from '../../../timeline/range-options';
import { selectTag } from '../../../timeline/select-tag';
import { rangeValue } from '../behavior/range-value';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import type { TagId } from '@bxel/document';
import { LOOP, PICKED, WHOLE } from './RangeSelect.constants';

const RangeSelect = ({ focus }: FocusProps) => {
  const tagId = useTimelineStore((state) => state.tagId);
  const rangePicked = useTimelineStore((state) => state.rangePicked);
  const loopRange = useTimelineStore((state) => state.loopRange);
  const known = tagId !== null && focus.animation.tags.some((tag) => tag.id === tagId);
  return (
    <Select
      size="sm"
      aria-label={TIMELINE_PANEL_TEXT.range}
      options={rangeOptions(focus.animation, loopRange !== null)}
      value={rangeValue(loopRange !== null, rangePicked, known ? tagId : null)}
      onChange={(next) => {
        const store = useTimelineStore.getState();
        if (next === LOOP) return;
        store.setLoopRange(null);
        if (next === WHOLE) store.selectTag(null);
        else if (next === PICKED) store.setRangePicked();
        else selectTag(next as TagId);
      }}
    />
  );
};

export { RangeSelect };
