/* @layer renderer-app @kind component */
import { ColorSwatch } from '@drizztdourden08/tessera';
import type { PointerEvent } from 'react';
import { swatchMarks } from '../../../editor/swatch-marks';
import { cornerMarks } from '../behavior/corner-marks';
import { copyDrop } from '../behavior/copy-drop';
import { gridKeyDown } from '../behavior/grid-key-down';
import { heldDrop } from '../behavior/held-drop';
import { swatchClick } from '../behavior/swatch-click';
import { usageText } from '../behavior/usage-text';
import { MARKLESS_SWATCH_SIZE, PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { GridCellProps } from '../PalettePanel.type';

const GridCell = ({ slot, panel, cell }: GridCellProps) => {
  const { index } = slot;
  const marks = swatchMarks(index, panel.held);
  const use = usageText(panel, index);
  const unused = panel.usage !== null && index > 0 && !slot.transparent && (panel.usage.slots[index]?.pixels ?? 0) === 0;
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (heldDrop(event, index) || copyDrop(panel, event, index)) cell.onPointerCancel?.();
    else cell.onPointerUp?.(event);
  };
  return (
    <ColorSwatch
      {...cell}
      color={slot.hex}
      marks={panel.view.size === MARKLESS_SWATCH_SIZE ? undefined : cornerMarks(marks)}
      transparent={slot.transparent}
      unused={unused}
      data-swatch-index={index}
      aria-label={PALETTE_PANEL_TEXT.name(slot.label, marks, use)}
      onKeyDown={(event) => {
        if (!gridKeyDown(event, { panel, index })) cell.onKeyDown(event);
      }}
      onClick={(event) => swatchClick(panel, index, event, false)}
      onDoubleClick={(event) => panel.editor.open(index, event.currentTarget)}
      onContextMenu={(event) => {
        event.preventDefault();
        swatchClick(panel, index, event, true);
      }}
      onMouseEnter={() => panel.setHovered(index)}
      onMouseLeave={() => panel.setHovered(null)}
      onPointerUp={onPointerUp}
    />
  );
};

export { GridCell };
