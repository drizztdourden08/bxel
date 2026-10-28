/* @layer renderer-app @kind component */
import { Box, Text } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { useTagDrag } from '../behavior/useTagDrag';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { LanesProps } from '../TimelinePanel.type';
import { TagBarView } from './TagBarView';
import { TagPopover } from './TagPopover';

const TagLanes = ({ focus, model, layout }: LanesProps) => {
  const content = useRef<HTMLDivElement>(null);
  const drag = useTagDrag(layout, focus.animation.frames.length, content);
  const tagId = useTimelineStore((state) => state.tagId);
  const bars = model.tagLanes.flat();
  const roving = (bars.find((bar) => bar.tagId === tagId) ?? bars[0])?.tagId ?? null;
  const create = drag.draft?.tagId === null ? drag.draft : null;
  return (
    <Box ref={content} role="group" aria-label={TIMELINE_PANEL_TEXT.tags} className="tag-lanes" style={{ inlineSize: layout.total }}>
      {model.tagLanes.map((lane, index) => (
        <Box key={index} role="presentation" className="tag-lane" data-tag-lane>
          {lane.map((bar) => (
            <TagBarView key={bar.tagId} focus={focus} bar={bar} layout={layout} thumb={0} roving={bar.tagId === roving} readOnly={focus.readOnly} drag={drag} />
          ))}
        </Box>
      ))}
      <Box
        role="presentation"
        className="tag-lane tag-lane--new"
        data-tag-lane
        onPointerDown={focus.readOnly ? undefined : drag.create}
        onPointerMove={drag.move}
        onPointerUp={(event) => drag.release(event)}
      >
        {create && (
          <Box
            className="tag-lane__draft"
            aria-hidden="true"
            style={{ insetInlineStart: layout.lefts[create.start], inlineSize: (layout.lefts[create.end] ?? 0) + (layout.widths[create.end] ?? 0) - (layout.lefts[create.start] ?? 0) }}
          />
        )}
        {bars.length === 0 && !create && (
          <Text as="span" variant="caption" tone="muted" className="tag-lane__hint">{TIMELINE_PANEL_TEXT.tagHint}</Text>
        )}
      </Box>
      <TagPopover focus={focus} container={content} />
    </Box>
  );
};

export { TagLanes };
