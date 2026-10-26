/* @layer renderer-app @kind component */
import { ALL_FACINGS } from '@bxel/document';
import type { AnimDirection, AnimFacing } from '@bxel/document';
import { Button, Flex, Icon, IconButton, NumberInput, Select, TextInput, Tooltip } from '@drizztdourden08/tessera';
import { changeTag } from '../../../timeline/change-tag';
import { deleteTag } from '../../../timeline/delete-tag';
import { setTagRange } from '../../../timeline/set-tag-range';
import { FACING_TEXT, TAG_DIRECTION_TEXT, TAG_DIRECTIONS, TIMELINE_LABEL } from '../../../timeline/timeline.constants';
import { REPEAT_MAX, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { TagEditorProps } from '../TimelinePanel.type';
import { TagColours } from './TagColours';

const NO_FACING = '';

const facingOptions = [
  { value: NO_FACING, label: TIMELINE_PANEL_TEXT.tagNoFacing },
  ...ALL_FACINGS.map((facing) => ({ value: facing, label: FACING_TEXT[facing] })),
];

const TagEditor = ({ tag, readOnly }: TagEditorProps) => {
  const rename = (name: string): void => {
    const next = name.trim();
    if (next !== '' && next !== tag.name) changeTag(TIMELINE_LABEL.renameTag, tag.id, { name: next });
  };
  return (
    <Flex gap="sm" align="center" wrap role="group" aria-label={TIMELINE_PANEL_TEXT.tagName}>
      <TextInput
        key={`${tag.id}:${tag.name}`}
        size="sm"
        defaultValue={tag.name}
        disabled={readOnly}
        aria-label={TIMELINE_PANEL_TEXT.tagName}
        onEnter={rename}
        onBlur={(event) => rename(event.currentTarget.value)}
      />
      <Select
        size="sm"
        aria-label={TIMELINE_PANEL_TEXT.tagDirection}
        options={TAG_DIRECTIONS.map((direction) => ({ value: direction, label: TAG_DIRECTION_TEXT[direction] }))}
        value={tag.direction}
        onChange={(direction) => changeTag(TIMELINE_LABEL.updateTag, tag.id, { direction: direction as AnimDirection })}
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
        onChange={(facing) => changeTag(TIMELINE_LABEL.updateTag, tag.id, { facing: facing === NO_FACING ? null : (facing as AnimFacing) })}
      />
      <TagColours tag={tag} readOnly={readOnly} />
      <Button size="sm" variant="secondary" disabled={readOnly} onClick={() => setTagRange(tag.id)}>
        {TIMELINE_PANEL_TEXT.tagRange}
      </Button>
      <Tooltip content={TIMELINE_PANEL_TEXT.tagDelete} placement="top">
        <IconButton label={TIMELINE_PANEL_TEXT.tagDelete} size="sm" disabled={readOnly} onClick={() => deleteTag(tag.id)}>
          <Icon name="pixel-frame-delete" />
        </IconButton>
      </Tooltip>
    </Flex>
  );
};

export { TagEditor };
