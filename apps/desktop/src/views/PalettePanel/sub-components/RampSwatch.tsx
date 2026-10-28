/* @layer renderer-app @kind component */
import { Box, ColorSwatch } from '@drizztdourden08/tessera';
import { swatchMarks } from '../../../editor/swatch-marks';
import { swatchClick } from '../behavior/swatch-click';
import { usageText } from '../behavior/usage-text';
import { PALETTE_PANEL_TEXT, RAMP_DRAG_TYPE } from '../PalettePanel.constants';
import type { RampSwatchProps } from '../PalettePanel.type';
import { CornerMarks } from './CornerMarks';

const RampSwatch = ({ panel, index, from }: RampSwatchProps) => {
  const slot = panel.slots[index];
  if (!slot) return null;
  const marks = swatchMarks(index, panel.held);
  return (
    <Box className="marked-swatch">
      <ColorSwatch
        size="sm"
        draggable={!panel.lock.locked}
        className={panel.selection.selected.has(index) ? 'ramp-row__swatch ramp-row__swatch--selected' : 'ramp-row__swatch'}
        color={slot.hex}
        data-swatch-index={index}
        aria-label={PALETTE_PANEL_TEXT.name(slot.label, marks, usageText(panel, index))}
        onDragStart={(event) => event.dataTransfer.setData(RAMP_DRAG_TYPE, JSON.stringify({ index, from }))}
        onClick={(event) => swatchClick(panel, index, event, false)}
        onDoubleClick={(event) => panel.editor.open(index, event.currentTarget)}
        onContextMenu={(event) => {
          event.preventDefault();
          swatchClick(panel, index, event, true);
        }}
      />
      <CornerMarks marks={marks} />
    </Box>
  );
};

export { RampSwatch };
