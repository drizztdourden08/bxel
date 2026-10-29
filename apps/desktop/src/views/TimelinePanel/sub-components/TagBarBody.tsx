/* @layer renderer-app @kind component */
import { Icon, Pressable, Text } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { selectTag } from '../../../timeline/select-tag';
import { tagBarKey } from '../behavior/tag-bar-key';
import { DIRECTION_ICON, FACING_ABBREVIATION } from '../TimelinePanel.constants';
import type { TagBarBodyProps } from './TagBarBody.type';

const TagBarBody = ({ bar, roving, editable, drag }: TagBarBodyProps) => (
  <Pressable
    className="tag-bar__body"
    data-tag-id={bar.tagId}
    aria-pressed={bar.selected}
    aria-label={bar.label}
    tabIndex={roving ? 0 : -1}
    onClick={(event) => {
      if (drag.draft !== null) return;
      if (event.shiftKey) selectTag(bar.tagId);
      else useTimelineStore.getState().selectTag(bar.tagId);
    }}
    onDoubleClick={() => !bar.mirror && useTimelineStore.getState().setPopover({ kind: 'tag', tagId: bar.tagId })}
    onKeyDown={(event) => tagBarKey(event, bar, editable)}
    onPointerDown={editable ? (event) => drag.grab(bar, event, 'move') : undefined}
    onPointerMove={drag.move}
    onPointerUp={(event) => drag.release(event)}
  >
    <Icon name={bar.mirror ? 'pixel-flip-h' : DIRECTION_ICON[bar.direction]} size={12} aria-hidden="true" />
    <Text as="span" variant="caption" className="tag-bar__name">{bar.name}</Text>
    {!bar.mirror && bar.repeat > 0 && <Text as="span" variant="caption" tone="muted" numeric>{`x${bar.repeat}`}</Text>}
    {bar.facing !== null && <Text as="span" variant="caption" tone="muted" className="tag-bar__facing">{FACING_ABBREVIATION[bar.facing]}</Text>}
  </Pressable>
);

export { TagBarBody };
