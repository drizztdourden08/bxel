/* @layer renderer-app @kind component */
import { Box, ColorSwatch } from '@drizztdourden08/tessera';
import { swatchMarks } from '../../../editor/swatch-marks';
import { cellClass } from '../behavior/cell-class';
import { cornerMarks } from '../behavior/corner-marks';
import { swatchClick } from '../behavior/swatch-click';
import { usageText } from '../behavior/usage-text';
import { MARKLESS_SWATCH_SIZE, PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { GridCellProps } from '../PalettePanel.type';

const GridCell = ({ slot, panel, control }: GridCellProps) => {
  const { index } = slot;
  const marks = swatchMarks(index, panel.held);
  const use = usageText(panel, index);
  const selected = panel.selection.selected.has(index);
  const unused = panel.usage !== null && index > 0 && !slot.transparent && (panel.usage.slots[index]?.pixels ?? 0) === 0;
  const look = { selected, hinted: panel.hinted === index, unused, dragging: control.drag.dragging === index, drop: control.drag.dropMark(index, panel.slots.length) };
  const id = panel.target.bank.slots[index]?.id ?? '';
  return (
    <Box className={cellClass(look)} data-reorder-index={index} data-reorder-key={id}>
      <ColorSwatch
        role="option"
        aria-selected={selected}
        tabIndex={panel.selection.focus === index ? 0 : -1}
        className="grid-cell__swatch"
        color={slot.hex}
        marks={panel.view.size === MARKLESS_SWATCH_SIZE ? undefined : cornerMarks(marks)}
        transparent={slot.transparent}
        data-swatch-index={index}
        aria-label={PALETTE_PANEL_TEXT.name(slot.label, marks, use)}
        onFocus={() => panel.selection.setFocus(index)}
        onKeyDown={control.keyDown(index)}
        onClick={(event) => swatchClick(panel, index, event, false)}
        onDoubleClick={(event) => panel.editor.open(index, event.currentTarget)}
        onContextMenu={(event) => {
          event.preventDefault();
          swatchClick(panel, index, event, true);
        }}
        onMouseEnter={() => panel.setHovered(index)}
        onMouseLeave={() => panel.setHovered(null)}
        {...control.pointer(index)}
      />
    </Box>
  );
};

export { GridCell };
