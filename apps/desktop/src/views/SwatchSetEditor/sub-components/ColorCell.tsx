/* @layer renderer-app @kind component */
import { ColorSwatch, Span } from '@drizztdourden08/tessera';
import { ColorPickerPopover } from '@drizztdourden08/tessera/color-picker-popover';
import { useRef } from 'react';
import type { ColorCellProps } from '../SwatchSetEditor.type';

const ColorCell = ({ rgb, label, selected, open, onOpen, onClose, onChange }: ColorCellProps) => {
  const anchor = useRef<HTMLSpanElement>(null);
  return (
    <Span ref={anchor}>
      <ColorSwatch color={rgb} selected={selected} aria-label={label} aria-expanded={open} aria-haspopup="dialog" onClick={onOpen} />
      <ColorPickerPopover open={open} anchorRef={anchor} value={rgb} disableAlpha onChange={onChange} onClose={onClose} />
    </Span>
  );
};

export { ColorCell };
