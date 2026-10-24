/* @layer renderer-app @kind types */
import type { PointerEvent, MouseEvent } from 'react';
import type { Artwork, Sprite, Tile, Tileset } from '@bxel/document';
import type { TileEditMode, TileStamp } from '../../stores/tilemap-store.type';

interface TileCell {
  tile: Tile;
  sprite: Sprite;
  uses: number;
  picked: boolean;
  editing: boolean;
}

interface TilesetModel {
  artwork: Artwork;
  tileset: Tileset;
  cells: readonly TileCell[];
  editMode: TileEditMode;
  stamp: TileStamp;
  selected: boolean;
  pickedKey: number | null;
}

interface TileHandlers {
  down: (index: number, event: PointerEvent<HTMLElement>) => void;
  enter: (index: number, event: PointerEvent<HTMLElement>) => void;
  up: () => void;
  click: (index: number, event: MouseEvent<HTMLElement>) => void;
}

interface TileGridProps {
  model: TilesetModel;
  handlers: TileHandlers;
}

interface TileButtonProps {
  cell: TileCell;
  index: number;
  artwork: Artwork;
  handlers: TileHandlers;
}

interface TileThumbProps {
  artwork: Artwork;
  sprite: Sprite;
}

interface TilesetActionsProps {
  model: TilesetModel;
  onDelete: (key: number) => void;
}

interface TilesetHeaderProps {
  model: TilesetModel;
}

export type { TileButtonProps, TileCell, TileGridProps, TileHandlers, TileThumbProps, TilesetActionsProps, TilesetHeaderProps, TilesetModel };
