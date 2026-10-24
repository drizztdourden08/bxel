/* @layer renderer-app @kind component */
import { Button, ColorSwatch, Field, Flex, Span, Stack, TextInput } from '@drizztdourden08/tessera';
import { ColorPickerPopover } from '@drizztdourden08/tessera/color-picker-popover';
import { useRef, useState } from 'react';
import { SWATCH_EDITOR_TEXT } from '../SwatchSetEditor.constants';
import type { SetBarProps } from '../SwatchSetEditor.type';

const ColorDetail = ({ model }: SetBarProps) => {
  const color = model.current?.colors[model.index];
  const anchor = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <Stack gap="sm">
      <Flex gap="sm" wrap>
        <Button size="sm" variant="secondary" disabled={model.current === null} onClick={model.addColor}>
          {SWATCH_EDITOR_TEXT.addColor}
        </Button>
        <Button size="sm" variant="secondary" disabled={(model.current?.colors.length ?? 0) <= 1} onClick={model.removeColor}>
          {SWATCH_EDITOR_TEXT.removeColor}
        </Button>
      </Flex>
      {color !== undefined && (
        <Flex gap="sm" align="end" wrap>
          <Field label={SWATCH_EDITOR_TEXT.colorName}>
            <TextInput value={color.name} onChange={(event) => model.nameColor(event.target.value)} />
          </Field>
          <Span ref={anchor}>
            <ColorSwatch color={color.rgb} aria-label={SWATCH_EDITOR_TEXT.changeColor(color.rgb)} aria-expanded={open} onClick={() => setOpen(!open)} />
            <ColorPickerPopover open={open} anchorRef={anchor} value={color.rgb} disableAlpha onChange={model.recolor} onClose={() => setOpen(false)} />
          </Span>
        </Flex>
      )}
    </Stack>
  );
};

export { ColorDetail };
