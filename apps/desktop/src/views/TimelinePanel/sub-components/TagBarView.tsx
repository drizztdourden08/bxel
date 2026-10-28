/* @layer renderer-app @kind component */
import { Box, Icon, Pressable, Text } from '@drizztdourden08/tessera';
import { nudgeTag } from '../../../timeline/nudge-tag';
import { selectTag } from '../../../timeline/select-tag';
import { tagLook } from '../../../timeline/tag-look';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { DIRECTION_ICON } from '../TimelinePanel.constants';
import { FACING_ABBREVIATION } from '../TimelinePanel.constants';
import type { TagBarViewProps } from '../TimelinePanel.type';

const TagBarView = ({ bar, layout, roving, readOnly, drag }: TagBarViewProps) => {
  const draft = drag.draft?.tagId === bar.tagId ? drag.draft : null;
  const start = draft?.start ?? bar.start;
  const end = draft?.end ?? bar.end;
  const left = layout.lefts[start] ?? 0;
  const width = (layout.lefts[end] ?? 0) + (layout.widths[end] ?? 0) - left;
  const editable = !bar.mirror && !readOnly;
  return (
    <Box
      className="tag-bar"
      style={{ insetInlineStart: left, inlineSize: width, ...(bar.custom === null ? {} : tagLook(bar.custom)) }}
      data-colour={bar.custom === null ? bar.colour : 'custom'}
      data-mirror={bar.mirror ? 'yes' : 'no'}
      data-selected={bar.selected ? 'yes' : 'no'}
      data-dragging={draft ? 'yes' : undefined}
    >
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
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !bar.mirror) {
            event.preventDefault();
            event.stopPropagation();
            useTimelineStore.getState().setPopover({ kind: 'tag', tagId: bar.tagId });
            return;
          }
          const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
          if (step === 0 || !editable || !event.altKey || !(event.shiftKey || event.ctrlKey)) return;
          event.preventDefault();
          event.stopPropagation();
          nudgeTag(bar.tagId, event.shiftKey ? 'resize' : 'move', step);
        }}
        onPointerDown={editable ? (event) => drag.grab(bar, event, 'move') : undefined}
        onPointerMove={drag.move}
        onPointerUp={(event) => drag.release(event)}
      >
        <Icon name={bar.mirror ? 'pixel-flip-h' : DIRECTION_ICON[bar.direction]} size={12} aria-hidden="true" />
        <Text as="span" variant="caption" className="tag-bar__name">{bar.name}</Text>
        {!bar.mirror && bar.repeat > 0 && <Text as="span" variant="caption" tone="muted" numeric>{`x${bar.repeat}`}</Text>}
        {bar.facing !== null && <Text as="span" variant="caption" tone="muted" className="tag-bar__facing">{FACING_ABBREVIATION[bar.facing]}</Text>}
      </Pressable>
      {editable && (
        <>
          <Box className="tag-bar__edge" data-edge="start" aria-hidden="true" onPointerDown={(event) => drag.grab(bar, event, 'start')} onPointerMove={drag.move} onPointerUp={(event) => drag.release(event)} />
          <Box className="tag-bar__edge" data-edge="end" aria-hidden="true" onPointerDown={(event) => drag.grab(bar, event, 'end')} onPointerMove={drag.move} onPointerUp={(event) => drag.release(event)} />
        </>
      )}
    </Box>
  );
};

export { TagBarView };
