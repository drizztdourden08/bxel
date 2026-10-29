/* @layer renderer-app @kind component */
import { Button, ColorSwatch, Span } from '@drizztdourden08/tessera';
import { ColorPickerPopover } from '@drizztdourden08/tessera/color-picker-popover';
import { useRef, useState } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { ONION_TEXT } from '../../../timeline/onion.constants';
import type { OnionColourProps } from './OnionColour.type';

const OnionColour = ({ side }: OnionColourProps) => {
  const anchor = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const field = side === 'before' ? 'beforeColour' : 'afterColour';
  const colour = useTimelineStore((state) => state.onion[field]);
  const tinted = useTimelineStore((state) => state.onion.tint === 'split');
  const setOnion = useTimelineStore((state) => state.setOnion);
  const name = side === 'before' ? ONION_TEXT.beforeColour : ONION_TEXT.afterColour;
  return (
    <Span ref={anchor}>
      <Button size="sm" variant="secondary" disabled={!tinted} aria-haspopup="dialog" aria-expanded={open} aria-label={name} onClick={() => setOpen(true)}>
        <ColorSwatch size="sm" color={colour} aria-hidden="true" />
        {side === 'before' ? ONION_TEXT.beforeCaption : ONION_TEXT.afterCaption}
      </Button>
      <ColorPickerPopover
        open={open}
        anchorRef={anchor}
        value={colour}
        disableAlpha
        title={name}
        onChange={(next) => setOnion({ [field]: next.toLowerCase() })}
        onClose={() => setOpen(false)}
      />
    </Span>
  );
};

export { OnionColour };
