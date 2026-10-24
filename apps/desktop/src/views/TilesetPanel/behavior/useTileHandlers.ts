/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { pickTile } from '../../../tilemap/pick-tile';
import { TILE_COLUMNS } from '../TilesetPanel.constants';
import type { TileHandlers, TilesetModel } from '../TilesetPanel.type';
import { rectStamp } from './rect-stamp';

const useTileHandlers = (model: TilesetModel): TileHandlers => {
  const anchor = useRef<number | null>(null);
  const pressed = useRef(false);
  const tiles = model.tileset.tiles;
  const pick = (index: number): void => {
    anchor.current = index;
    const key = tiles[index]?.key;
    if (key !== undefined) pickTile(key);
  };
  const span = (index: number): void => {
    const from = anchor.current;
    if (from === null || model.editMode === 'edit') return;
    useTilemapStore.getState().setStamp(rectStamp(tiles, from, index, TILE_COLUMNS));
  };
  return {
    down: (index, event) => {
      if (event.button !== 0) return;
      pressed.current = true;
      if (event.shiftKey && anchor.current !== null) span(index);
      else pick(index);
    },
    enter: (index, event) => {
      if (pressed.current && event.buttons === 1) span(index);
    },
    up: () => {
      pressed.current = false;
    },
    click: (index, event) => {
      if (event.detail === 0) pick(index);
    },
  };
};

export { useTileHandlers };
