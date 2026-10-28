/* @layer renderer-app @kind component */
import { ControlMenu, ControlMenuRow, Toggle } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { spanTagOf } from '../../../timeline/span-tag-of';
import { tagById } from '../../../timeline/tag-by-id';
import { FACING_ABBREVIATION, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { FacingPad } from './FacingPad';
import { FacingPreview } from './FacingPreview';

const FacingControl = ({ focus }: FocusProps) => {
  const tagId = useTimelineStore((state) => state.tagId);
  const [preview, setPreview] = useState(false);
  const tag = tagById(focus.animation, tagId);
  const facing = tag === undefined ? null : tag.kind === 'mirror' ? tag.facing : (spanTagOf(focus.animation, tag)?.facing ?? null);
  const shown = facing === null ? '-' : FACING_ABBREVIATION[facing];
  return (
    <ControlMenu
      size="sm"
      variant="secondary"
      label={TIMELINE_PANEL_TEXT.facing}
      trigger={{ label: `${TIMELINE_PANEL_TEXT.facing} ${shown}` }}
      header={<FacingPad focus={focus} />}
    >
      <ControlMenuRow label={TIMELINE_PANEL_TEXT.previewAll}>
        <Toggle size="sm" aria-label={TIMELINE_PANEL_TEXT.previewAll} checked={preview} onChange={setPreview} />
      </ControlMenuRow>
      {preview && (
        <ControlMenuRow label={TIMELINE_PANEL_TEXT.facingPad}>
          <FacingPreview focus={focus} />
        </ControlMenuRow>
      )}
    </ControlMenu>
  );
};

export { FacingControl };
