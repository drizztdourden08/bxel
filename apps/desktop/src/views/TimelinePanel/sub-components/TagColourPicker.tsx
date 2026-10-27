/* @layer renderer-app @kind component */
import { Button, Span } from '@drizztdourden08/tessera';
import { ColorPickerPopover } from '@drizztdourden08/tessera/color-picker-popover';
import { useRef, useState } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { setTagColour } from '../../../timeline/set-tag-colour';
import { TAG_COLOUR_START } from '../../../timeline/tag-colour.constants';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import type { TagEditorProps } from '../TimelinePanel.type';

const TagColourPicker = ({ tag, readOnly }: TagEditorProps) => {
  const anchor = useRef<HTMLSpanElement>(null);
  const open = useTimelineStore((state) => state.colourPicker) && !readOnly;
  const setOpen = useTimelineStore((state) => state.setColourPicker);
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? tag.colour ?? TAG_COLOUR_START;
  const close = (): void => {
    setOpen(false);
    const next = draft?.toLowerCase() ?? null;
    setDraft(null);
    if (next !== null && next !== tag.colour) setTagColour(tag.id, next);
  };
  return (
    <Span ref={anchor}>
      <Button size="sm" variant="secondary" disabled={readOnly} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {TIMELINE_TEXT.tagColourCustom}
      </Button>
      <ColorPickerPopover open={open} anchorRef={anchor} value={shown} disableAlpha title={TIMELINE_TEXT.tagColourCustomLabel} onChange={setDraft} onClose={close} />
    </Span>
  );
};

export { TagColourPicker };
