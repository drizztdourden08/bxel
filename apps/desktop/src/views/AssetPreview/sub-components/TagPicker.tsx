/* @layer renderer-app @kind component */
import { Select } from '@drizztdourden08/tessera';
import { ALL_FRAMES, PREVIEW_TEXT } from '../../../asset-preview/asset-preview.constants';
import type { TagPickerProps } from '../AssetPreview.type';

const TagPicker = ({ tags, tagId, onTag }: TagPickerProps) => (
  <Select
    options={[{ value: ALL_FRAMES, label: PREVIEW_TEXT.allFrames }, ...tags.map((tag) => ({ value: tag.id, label: tag.name }))]}
    value={tagId ?? ALL_FRAMES}
    onChange={(value) => onTag(value === ALL_FRAMES ? null : value)}
    aria-label={PREVIEW_TEXT.tag}
  />
);

export { TagPicker };
