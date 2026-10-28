/* @layer renderer-app @kind component */
import { ALL_FACINGS } from '@bxel/document';
import { Button, Flex, Icon, IconButton, NumberInput, Select, Stack, TextInput, Tooltip } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { changeTag } from '../../../timeline/change-tag';
import { currentFocus } from '../../../timeline/current-focus';
import { deleteTag } from '../../../timeline/delete-tag';
import { setTagRange } from '../../../timeline/set-tag-range';
import { tagById } from '../../../timeline/tag-by-id';
import { FACING_TEXT, TAG_DIRECTION_TEXT, TAG_DIRECTIONS, TIMELINE_LABEL } from '../../../timeline/timeline.constants';
import { NO_FACING, REPEAT_MAX, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { TagEditorProps } from '../TimelinePanel.type';
import { TagColours } from './TagColours';

const facingOptions = [
  { value: NO_FACING, label: TIMELINE_PANEL_TEXT.tagNoFacing },
  ...ALL_FACINGS.map((facing) => ({ value: facing, label: FACING_TEXT[facing] })),
];

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
      <Flex gap="sm" align="center" wrap>
        <Select
          size="sm"
          aria-label={TIMELINE_PANEL_TEXT.tagDirection}
          options={TAG_DIRECTIONS.map((direction) => ({ value: direction, label: TAG_DIRECTION_TEXT[direction] }))}
          value={tag.direction}
          disabled={readOnly}
          onChange={(direction) => changeTag(TIMELINE_LABEL.updateTag, tag.id, { direction })}
        />
        <NumberInput
          key={`${tag.id}:${tag.repeat}`}
          size="sm"
          sizeToContent
          min={0}
          max={REPEAT_MAX}
          step={1}
          value={tag.repeat}
          disabled={readOnly}
          aria-label={TIMELINE_PANEL_TEXT.tagRepeat}
          onChange={(repeat) => changeTag(TIMELINE_LABEL.updateTag, tag.id, { repeat: Math.min(Math.max(Math.round(repeat) || 0, 0), REPEAT_MAX) })}
        />
        <Select
          size="sm"
          aria-label={TIMELINE_PANEL_TEXT.tagFacing}
          options={facingOptions}
          value={tag.facing ?? NO_FACING}
          disabled={readOnly}
          onChange={(facing) => changeTag(TIMELINE_LABEL.updateTag, tag.id, { facing: facing === NO_FACING ? null : facing })}
        />
      </Flex>
      <Flex gap="sm" align="center" wrap>
        <TagColours tag={tag} readOnly={readOnly} />
        <Button size="sm" variant="secondary" disabled={readOnly} onClick={() => setTagRange(tag.id)}>
          {TIMELINE_PANEL_TEXT.tagRange}
        </Button>
        <Tooltip content={TIMELINE_PANEL_TEXT.tagDelete} placement="top">
          <IconButton
            label={TIMELINE_PANEL_TEXT.tagDelete}
            size="sm"
            disabled={readOnly}
            onClick={() => {
              useTimelineStore.getState().setPopover(null);
              deleteTag(tag.id);
            }}
          >
            <Icon name="pixel-frame-delete" />
          </IconButton>
        </Tooltip>
      </Flex>
    </Stack>
  );
};

export { TagEditor };
