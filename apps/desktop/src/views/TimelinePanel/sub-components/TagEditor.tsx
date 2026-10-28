/* @layer renderer-app @kind component */
import { Stack, TextInput } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { changeTag } from '../../../timeline/change-tag';
import { currentFocus } from '../../../timeline/current-focus';
import { tagById } from '../../../timeline/tag-by-id';
import { TIMELINE_LABEL } from '../../../timeline/timeline.constants';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { TagEditorProps } from '../TimelinePanel.type';
import { TagActions } from './TagActions';
import { TagOptions } from './TagOptions';

const TagEditor = ({ tagId, readOnly }: TagEditorProps) => {
  const name = useRef<HTMLInputElement>(null);
  const focus = currentFocus();
  const found = focus ? tagById(focus.animation, tagId) : undefined;
  const tag = found?.kind === 'span' ? found : undefined;
  useEffect(() => {
    name.current?.focus();
    name.current?.select();
  }, []);
  if (!tag) return null;
  const rename = (next: string): void => {
    const text = next.trim();
    if (text !== '' && text !== tag.name) changeTag(TIMELINE_LABEL.renameTag, tag.id, { name: text });
  };
  return (
    <Stack gap="sm" role="group" aria-label={TIMELINE_PANEL_TEXT.tagName}>
      <TextInput
        ref={name}
        key={`${tag.id}:${tag.name}`}
        size="sm"
        defaultValue={tag.name}
        disabled={readOnly}
        aria-label={TIMELINE_PANEL_TEXT.tagName}
        onEnter={(value) => {
          rename(value);
          useTimelineStore.getState().setPopover(null);
        }}
        onBlur={(event) => rename(event.currentTarget.value)}
      />
      <TagOptions tag={tag} readOnly={readOnly} />
      <TagActions tag={tag} readOnly={readOnly} />
    </Stack>
  );
};

export { TagEditor };
