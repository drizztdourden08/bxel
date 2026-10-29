/* @layer renderer-app @kind component */
import { ALL_FACINGS } from '@bxel/document';
import { Flex, NumberInput, Select } from '@drizztdourden08/tessera';
import { changeTag } from '../../../timeline/change-tag';
import { FACING_TEXT, TAG_DIRECTION_TEXT, TAG_DIRECTIONS, TIMELINE_LABEL } from '../../../timeline/timeline.constants';
import { NO_FACING, REPEAT_MAX, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { TagPartProps } from '../TimelinePanel.type';

const facingOptions = [
  { value: NO_FACING, label: TIMELINE_PANEL_TEXT.tagNoFacing },
  ...ALL_FACINGS.map((facing) => ({ value: facing, label: FACING_TEXT[facing] })),
];

const TagOptions = ({ tag, readOnly }: TagPartProps) => (
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
);

export { TagOptions };
