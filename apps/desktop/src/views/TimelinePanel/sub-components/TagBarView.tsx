/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { tagLook } from '../../../timeline/tag-look';
import { tagBarBox } from '../behavior/tag-bar-box';
import { tagBarData } from '../behavior/tag-bar-data';
import type { TagBarViewProps } from '../TimelinePanel.type';
import { TagBarBody } from './TagBarBody';
import { TagBarEdges } from './TagBarEdges';

const TagBarView = ({ bar, layout, roving, readOnly, drag }: TagBarViewProps) => {
  const draft = drag.draft?.tagId === bar.tagId ? drag.draft : null;
  const { left, width } = tagBarBox(bar, layout, draft);
  const editable = !bar.mirror && !readOnly;
  return (
    <Box
      className="tag-bar"
      style={{ insetInlineStart: left, inlineSize: width, ...(bar.custom === null ? {} : tagLook(bar.custom)) }}
      {...tagBarData(bar, draft)}
    >
      <TagBarBody bar={bar} roving={roving} editable={editable} drag={drag} />
      {editable && <TagBarEdges bar={bar} drag={drag} />}
    </Box>
  );
};

export { TagBarView };
