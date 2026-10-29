/* @layer renderer-app @kind component */
import { Box, Canvas } from '@drizztdourden08/tessera';
import { cellEvents } from '../behavior/cell-events';
import { tileLabel } from '../behavior/tile-label';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TileCellProps } from '../TilesetPanel.type';
import { TileBadges } from './TileBadges';
import { TileMarks } from './TileMarks';
import { TileThumb } from './TileThumb';

const TileSlot = ({ cell, index, view, handlers }: TileCellProps) => {
  const events = cellEvents(index, view.focused, handlers);
  if (!cell) {
    return (
      <Box role="gridcell" aria-label={TILESET_TEXT.emptySlot(index + 1)} className="tileset-panel__cell tileset-panel__cell--hole" {...events}>
        <Canvas width={view.tileset.tileWidth * view.zoom} height={view.tileset.tileHeight * view.zoom} className="tileset-panel__hole" aria-hidden="true" />
      </Box>
    );
  }
  const label = tileLabel(cell, cell.sprite.name);
  const painting = view.painted.has(cell.tile.key);
  return (
    <Box
      role="gridcell"
      aria-selected={cell.picked}
      aria-label={label}
      title={cell.editing ? TILESET_TEXT.editing : label}
      className="tileset-panel__cell"
      data-picked={cell.picked ? '' : undefined}
      data-editing={cell.editing ? '' : undefined}
      data-dim={cell.matches ? undefined : ''}
      data-painting={painting ? '' : undefined}
      data-tile-key={cell.tile.key}
      data-tile-animated={cell.tile.animation ? '' : undefined}
      {...events}
    >
      <TileThumb view={view} cell={cell} />
      <TileBadges view={view} cell={cell} />
      {view.mode === 'terrain' && view.terrain ? <TileMarks view={view} cell={cell} /> : null}
    </Box>
  );
};

export { TileSlot };
