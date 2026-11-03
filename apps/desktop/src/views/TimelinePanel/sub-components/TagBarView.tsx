/* @layer renderer-app @kind component */
import { announce } from '@drizztdourden08/brock-react';
import { Icon, SpanBar, Text } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { selectTag } from '../../../timeline/select-tag';
import { setTagSpan } from '../../../timeline/set-tag-span';
import { tagCategory } from '../behavior/tag-category';
import { DIRECTION_ICON, FACING_ABBREVIATION } from '../TimelinePanel.constants';
import type { TagBarViewProps } from '../TimelinePanel.type';

const TagBarView = ({ bar, layout, readOnly }: TagBarViewProps) => (
  <SpanBar
    className="tag-bar"
    start={bar.start}
    end={bar.end}
    cells={layout}
    label={bar.label}
    selected={bar.selected}
    readOnly={readOnly || bar.mirror}
    colour={tagCategory(bar.colour)}
    tint={bar.custom ?? undefined}
    data={{ 'data-tag-id': bar.tagId }}
    announce={announce}
    onChange={({ start, end }) => setTagSpan(bar.tagId, start, end)}
    onSelect={(event) => (event.shiftKey ? selectTag(bar.tagId) : useTimelineStore.getState().selectTag(bar.tagId))}
    onActivate={() => !bar.mirror && useTimelineStore.getState().setPopover({ kind: 'tag', tagId: bar.tagId })}
  >
    <Icon name={bar.mirror ? 'pixel-flip-h' : DIRECTION_ICON[bar.direction]} size={12} aria-hidden="true" />
    <Text as="span" variant="caption" className="tag-bar__name">{bar.name}</Text>
    {!bar.mirror && bar.repeat > 0 && <Text as="span" variant="caption" tone="muted" numeric>{`x${bar.repeat}`}</Text>}
    {bar.facing !== null && <Text as="span" variant="caption" tone="muted" className="tag-bar__facing">{FACING_ABBREVIATION[bar.facing]}</Text>}
  </SpanBar>
);

export { TagBarView };
