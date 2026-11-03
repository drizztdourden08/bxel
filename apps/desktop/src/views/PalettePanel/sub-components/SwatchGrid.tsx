/* @layer renderer-app @kind component */
import { Box, VirtualGrid } from '@drizztdourden08/tessera';
import type { VirtualGridCellBind } from '@drizztdourden08/tessera';
import type { PaletteSlot } from '../../../editor/palette-slots.type';
import { useSwatchGrid } from '../behavior/useSwatchGrid';
import type { PanelProps } from '../PalettePanel.type';
import { AddTile } from './AddTile';
import { GridCell } from './GridCell';
import { SwatchReadout } from './SwatchReadout';

const SwatchGrid = ({ panel }: PanelProps) => {
  const grid = useSwatchGrid(panel);
  return (
    <>
      <Box className="palette-panel__swatches">
        <VirtualGrid
          {...grid.props}
          ref={grid.handle}
          className="palette-panel__grid"
          trailing={(cell: VirtualGridCellBind) => <AddTile panel={panel} cell={cell} reveal={grid.reveal} />}
          renderTile={(slot: PaletteSlot, _index: number, cell: VirtualGridCellBind) => <GridCell slot={slot} panel={panel} cell={cell} />}
        />
      </Box>
      <SwatchReadout panel={panel} />
    </>
  );
};

export { SwatchGrid };
