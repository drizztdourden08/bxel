/* @layer renderer-app @kind component */
import { Box, ScrollArea } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import type { WheelEvent } from 'react';
import { useGridControl } from '../behavior/useGridControl';
import { wheelSize } from '../behavior/wheel-size';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';
import { AddTile } from './AddTile';
import { GridCell } from './GridCell';

const SwatchGrid = ({ panel }: PanelProps) => {
  const listRef = useRef<HTMLElement>(null);
  const control = useGridControl(panel, listRef);
  const onWheel = (event: WheelEvent<HTMLElement>) => {
    if (!event.ctrlKey) return;
    const size = wheelSize(panel.view.size, event.deltaY);
    if (size !== panel.view.size) panel.view.change({ size });
  };
  return (
    <ScrollArea axis="y" scrollbar="slim" fade={false} className="palette-panel__swatches">
      <Box className={`swatch-grid swatch-grid--size-${panel.view.size}`} onWheel={onWheel}>
        <Box ref={listRef} role="listbox" aria-label={PALETTE_PANEL_TEXT.grid} aria-multiselectable="true" className="swatch-grid__list">
          {panel.slots.map((slot) => (
            <GridCell key={panel.target.bank.slots[slot.index]?.id ?? slot.index} slot={slot} panel={panel} control={control} />
          ))}
        </Box>
        <AddTile panel={panel} />
      </Box>
    </ScrollArea>
  );
};

export { SwatchGrid };
