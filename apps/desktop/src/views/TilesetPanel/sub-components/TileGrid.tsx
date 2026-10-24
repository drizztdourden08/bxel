/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TileGridProps } from '../TilesetPanel.type';
import { TileButton } from './TileButton';

const TileGrid = ({ model, handlers }: TileGridProps) => (
  <Box className="tileset-panel__grid" role="group" aria-label={TILESET_TEXT.grid} onPointerLeave={handlers.up}>
    {model.cells.map((cell, index) => (
      <TileButton key={cell.tile.id} cell={cell} index={index} artwork={model.artwork} handlers={handlers} />
    ))}
  </Box>
);

export { TileGrid };
