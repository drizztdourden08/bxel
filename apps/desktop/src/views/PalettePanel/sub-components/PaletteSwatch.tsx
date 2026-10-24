/* @layer renderer-app @kind component */
import { ColorSwatch } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { PALETTE_PANEL_TEXT, swatchHint } from '../PalettePanel.constants';
import type { PaletteSwatchProps } from '../PalettePanel.type';

const PaletteSwatch = (props: PaletteSwatchProps) => {
  const { slot, role, onPick } = props;
  return (
    <ActionHint hint={swatchHint(slot.label)} placement="top">
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
    </ActionHint>
  );
};

export { PaletteSwatch };
