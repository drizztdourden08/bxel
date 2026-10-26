/* @layer renderer-app @kind component */
import { formatSwatchColor } from '@bxel/document';
import type { Rgb } from '@bxel/document';
import { ColorSwatch, Span } from '@drizztdourden08/tessera';
import { ColorPickerPopover } from '@drizztdourden08/tessera/color-picker-popover';
import { useRef } from 'react';
import { alphaToUnit } from '../../../palette-bank/alpha-to-unit';
import { unitToAlpha } from '../../../palette-bank/unit-to-alpha';
import type { ColorCellProps } from '../SwatchSetEditor.type';

const ColorCell = ({ rgb, alpha, label, selected, open, onOpen, onClose, onChange }: ColorCellProps) => {
  const anchor = useRef<HTMLSpanElement>(null);
  const latest = useRef({ rgb, alpha });
  if (!open) latest.current = { rgb, alpha };
  const change = (next: Partial<typeof latest.current>): void => {
    latest.current = { ...latest.current, ...next };
    onChange(latest.current.rgb, latest.current.alpha);
  };
  return (
    <Span ref={anchor}>
      <ColorSwatch color={formatSwatchColor(rgb as Rgb, alpha)} selected={selected} aria-label={label} aria-expanded={open} aria-haspopup="dialog" onClick={onOpen} />
      <ColorPickerPopover
        open={open}
        anchorRef={anchor}
        value={rgb}
        alpha={alphaToUnit(alpha)}
        onAlphaChange={(unit) => change({ alpha: unitToAlpha(unit) })}
        onChange={(hex) => change({ rgb: hex })}
        onClose={onClose}
      />
    </Span>
  );
};

export { ColorCell };
