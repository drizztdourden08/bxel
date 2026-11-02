/* @layer renderer-app @kind component */
import { Button, ColorSwatch, Span, Stack, Toggle } from '@drizztdourden08/tessera';
import { ColorPickerPopover } from '@drizztdourden08/tessera/color-picker-popover';
import { useRef, useState } from 'react';
import { SLICE_DIALOG_TEXT } from '../SliceDialog.constants';
import type { SliceFieldsProps } from '../SliceDialog.type';

const SliceColour = ({ model }: SliceFieldsProps) => {
  const anchor = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const { form, update } = model;
  return (
    <Stack gap="sm">
      <Toggle size="sm" label={SLICE_DIALOG_TEXT.colourOn} description={SLICE_DIALOG_TEXT.colourHint} checked={form.colourOn} onChange={(colourOn) => update({ colourOn })} />
      {form.colourOn && (
        <Span ref={anchor}>
          <Button size="sm" variant="secondary" aria-haspopup="dialog" aria-expanded={open} aria-label={SLICE_DIALOG_TEXT.colour} onClick={() => setOpen(true)}>
            <ColorSwatch size="sm" color={form.colour} aria-hidden="true" />
            {SLICE_DIALOG_TEXT.colour}
          </Button>
          <ColorPickerPopover open={open} anchorRef={anchor} value={form.colour} disableAlpha title={SLICE_DIALOG_TEXT.colour} onChange={(next) => update({ colour: next })} onClose={() => setOpen(false)} />
        </Span>
      )}
    </Stack>
  );
};

export { SliceColour };
