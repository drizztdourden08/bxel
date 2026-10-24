/* @layer renderer-app @kind component */
import { Button, Flex, Icon, IconButton, SegmentedControl, TextInput, Tooltip } from '@drizztdourden08/tessera';
import { changeTag } from '../../../timeline/change-tag';
import { deleteTag } from '../../../timeline/delete-tag';
import { setTagRange } from '../../../timeline/set-tag-range';
import { TAG_DIRECTION_TEXT, TAG_DIRECTIONS, TIMELINE_LABEL } from '../../../timeline/timeline.constants';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { TagEditorProps } from '../TimelinePanel.type';
import { TagColours } from './TagColours';

const TagEditor = ({ tag }: TagEditorProps) => {
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
        aria-label={TIMELINE_PANEL_TEXT.tagName}
        onEnter={rename}
        onBlur={(event) => rename(event.currentTarget.value)}
      />
      <SegmentedControl
        size="sm"
        aria-label={TIMELINE_PANEL_TEXT.tagDirection}
        value={tag.direction}
        options={TAG_DIRECTIONS.map((direction) => ({ value: direction, label: TAG_DIRECTION_TEXT[direction] }))}
        onChange={(direction) => changeTag(TIMELINE_LABEL.updateTag, tag.id, { direction })}
      />
      <TagColours tag={tag} />
      <Button size="sm" variant="secondary" onClick={() => setTagRange(tag.id)}>
        {TIMELINE_PANEL_TEXT.tagRange}
      </Button>
      <Tooltip content={TIMELINE_PANEL_TEXT.tagDelete} placement="top">
        <IconButton label={TIMELINE_PANEL_TEXT.tagDelete} size="sm" onClick={() => deleteTag(tag.id)}>
          <Icon name="pixel-frame-delete" />
        </IconButton>
      </Tooltip>
    </Flex>
  );
};

export { TagEditor };
