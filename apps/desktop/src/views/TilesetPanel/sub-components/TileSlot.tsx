/* @layer renderer-app @kind component */
import type { KeyboardEvent, PointerEvent } from 'react';
import { Box, Canvas } from '@drizztdourden08/tessera';
import { tileLabel } from '../behavior/tile-label';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TileCellProps } from '../TilesetPanel.type';
import { TileBadges } from './TileBadges';
import { TileThumb } from './TileThumb';

const TileSlot = ({ cell, index, view, handlers }: TileCellProps) => {
  const events = {
    'data-grid-index': index,
    tabIndex: view.focused === index ? 0 : -1,
    onPointerDown: (event: PointerEvent<HTMLElement>) => handlers.down(index, event),
    onPointerEnter: (event: PointerEvent<HTMLElement>) => handlers.enter(index, event),
    onPointerUp: handlers.up,
    onFocus: () => handlers.focus(index),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => handlers.keyDown(index, event),
  };
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
    </Box>
  );
};

export { TileSlot };
