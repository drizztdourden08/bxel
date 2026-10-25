/* @layer renderer-app @kind component */
import { ColorSwatch } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { PALETTE_PANEL_TEXT, swatchHint } from '../PalettePanel.constants';
import type { PaletteSwatchProps } from '../PalettePanel.type';

const PaletteSwatch = (props: PaletteSwatchProps) => {
  const { slot, marks, onPick, onEdit } = props;
  return (
    <ActionHint hint={swatchHint(slot.label)} placement="top" className="palette-panel__anchor">
      <ColorSwatch
        className="palette-panel__swatch"
        color={slot.hex}
        transparent={slot.transparent}
        selected={marks.length > 0}
        caption={marks.length > 0 ? PALETTE_PANEL_TEXT.caption(marks) : undefined}
        aria-label={PALETTE_PANEL_TEXT.name(slot.label, marks)}
        onClick={(event) => onPick(slot.index, { right: false, shift: event.shiftKey })}
        onDoubleClick={(event) => onEdit(slot.index, event.currentTarget)}
        onContextMenu={(event) => {
          event.preventDefault();
          onPick(slot.index, { right: true, shift: event.shiftKey });
        }}
      />
    </ActionHint>
  );
};

export { PaletteSwatch };
