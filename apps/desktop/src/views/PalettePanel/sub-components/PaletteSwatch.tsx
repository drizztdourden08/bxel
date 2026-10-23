/* @layer renderer-app @kind component */
import { ColorSwatch, Tooltip } from '@drizztdourden08/tessera';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { PaletteSwatchProps } from '../PalettePanel.type';

const PaletteSwatch = (props: PaletteSwatchProps) => {
  const { slot, role, onPick } = props;
  return (
    <Tooltip content={slot.label}>
      <ColorSwatch
        className="palette-panel__swatch"
        color={slot.hex}
        transparent={slot.transparent}
        selected={role === 'foreground'}
        caption={PALETTE_PANEL_TEXT.caption(slot.index, role)}
        aria-label={PALETTE_PANEL_TEXT.name(slot.label, role)}
        onClick={(event) => onPick(slot.index, event.shiftKey ? 'background' : 'foreground')}
        onContextMenu={(event) => {
          event.preventDefault();
          onPick(slot.index, 'background');
        }}
      />
    </Tooltip>
  );
};

export { PaletteSwatch };
