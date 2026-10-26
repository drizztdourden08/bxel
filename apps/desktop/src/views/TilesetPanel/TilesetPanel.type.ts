/* @layer renderer-app @kind types */
import type { PointerEvent, MouseEvent, RefObject } from 'react';
import type { Artwork, Size, TerrainRules, Sprite, Tile, TileCollision, Tileset } from '@bxel/document';
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

interface AnimationPartProps {
  artwork: Artwork;
  tileset: Tileset;
  tile: Tile;
}

interface TilesetActionsProps {
  model: TilesetModel;
  onDelete: (key: number) => void;
}

interface TilesetHeaderProps {
  model: TilesetModel;
}

interface CollisionProps {
  artwork: Artwork;
  tileset: Tileset;
  tile: Tile;
  sprite: Sprite;
}

interface TerrainSlotProps {
  index: number;
  mask: number;
  cell: TileCell | undefined;
  artwork: Artwork;
  onPick: (index: number) => void;
}

interface TerrainSlotsProps {
  model: TilesetModel;
  rules: TerrainRules;
  onPick: (index: number) => void;
}

interface TerrainActionsProps {
  model: TilesetModel;
  rules: TerrainRules;
}

interface CollisionCanvasHandle {
  canvas: RefObject<HTMLCanvasElement | null>;
  pointerDown: (event: PointerEvent<HTMLCanvasElement>) => void;
  pointerMove: (event: PointerEvent<HTMLCanvasElement>) => void;
  pointerUp: () => void;
  doubleClick: (event: MouseEvent<HTMLCanvasElement>) => void;
}

interface CollisionPaint {
  tile: HTMLCanvasElement | null;
  size: Size;
  scale: number;
  shape: TileCollision | null;
  colour: string;
}

export type { AnimationPartProps, TerrainActionsProps, TerrainSlotProps, TerrainSlotsProps, CollisionCanvasHandle, CollisionPaint, CollisionProps, TileButtonProps, TileCell, TileGridProps, TileHandlers, TileThumbProps, TilesetActionsProps, TilesetHeaderProps, TilesetModel };
