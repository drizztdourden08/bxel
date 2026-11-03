/* @layer renderer-app @kind component */
import { Box, SpanLane, Text } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { addTag } from '../../../timeline/add-tag';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { LanesProps } from '../TimelinePanel.type';
import { TagBarView } from './TagBarView';
import { TagPopover } from './TagPopover';

const TagLanes = ({ focus, model, layout }: LanesProps) => {
  const content = useRef<HTMLDivElement>(null);
  const empty = model.tagLanes.flat().length === 0;
  return (
    <Box ref={content} role="group" aria-label={TIMELINE_PANEL_TEXT.tags} className="tag-lanes" style={{ inlineSize: layout.total }}>
      {model.tagLanes.map((lane, index) => (
        <Box key={index} role="presentation" data-tag-lane>
          <SpanLane cells={layout} className="tag-lane">
            {lane.map((bar) => (
              <TagBarView key={bar.tagId} focus={focus} bar={bar} layout={layout} thumb={0} readOnly={focus.readOnly} />
            ))}
          </SpanLane>
        </Box>
      ))}
      <Box role="presentation" data-tag-lane>
        <SpanLane cells={layout} className="tag-lane tag-lane--new" readOnly={focus.readOnly} onCreate={({ start, end }) => addTag({ start, end })}>
          {empty && <Text as="span" variant="caption" tone="muted" className="tag-lane__hint">{TIMELINE_PANEL_TEXT.tagHint}</Text>}
        </SpanLane>
      </Box>
      <TagPopover focus={focus} container={content} />
    </Box>
  );
};

export { TagLanes };
