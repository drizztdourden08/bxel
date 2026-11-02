/* @layer renderer-app @kind types */
import type { VirtualGridCellBind } from '@drizztdourden08/tessera';
import type { KeyboardEvent, MouseEvent, PointerEvent, RefObject } from 'react';
import type { TerrainContext } from './behavior/terrain-panel.type';
import type { Artwork, FieldValue, Point, Sprite, Tile, TileField, TileLayout, TileShape, Tileset } from '@bxel/document';
import type { TileEditMode, TileStamp } from '../../stores/tilemap-store.type';
import type { ThumbZoom, TilesetMode } from '../../stores/tileset-view-store.type';

interface TileCell {
  tile: Tile;
  sprite: Sprite;
  uses: number;
  picked: boolean;
  editing: boolean;
  index: number;
  matches: boolean;
  terrainSlot: number | null;
}

interface TilesetModel {
  artwork: Artwork;
  tileset: Tileset;
  layout: TileLayout;
  cells: readonly TileCell[];
  slots: readonly (TileCell | null)[];
  byKey: ReadonlyMap<number, TileCell>;
  editMode: TileEditMode;
  stamp: TileStamp;
  selected: readonly number[];
  pickedKey: number | null;
  mapSelected: boolean;
  filtering: boolean;
  matched: number;
  hasMap: boolean;
}

interface GridView {
  artwork: Artwork;
  tileset: Tileset;
  mode: TilesetMode;
  zoom: number;
  showKeys: boolean;
  showUses: boolean;
  animate: boolean;
  painted: ReadonlySet<number>;
  order: ReadonlyMap<number, number>;
  terrain: TerrainContext | null;
}

interface GridHandlers {
  down: (index: number, event: PointerEvent<HTMLElement>) => void;
  enter: (index: number, event: PointerEvent<HTMLElement>) => void;
  up: () => void;
  leave: () => void;
  dragStart: () => void;
  dragEnd: () => void;
  keyDown: (index: number, event: KeyboardEvent<HTMLElement>) => void;
}

interface TilePaint {
  active: boolean;
  painted: ReadonlySet<number>;
  add: (key: number | null) => void;
  commit: () => void;
}

interface GridSelection {
  handlers: GridHandlers;
}

interface TileGridProps {
  model: TilesetModel;
  view: GridView;
  handlers: GridHandlers;
}

interface TileCellProps {
  cell: TileCell | null;
  index: number;
  bind: VirtualGridCellBind;
  view: GridView;
  handlers: GridHandlers;
}

interface TileThumbProps {
  view: GridView;
  cell: TileCell;
}

interface TerrainContextProps {
  model: TilesetModel;
  tileKey: number;
}

interface TilesetModelProps {
  model: TilesetModel;
}

interface AnimationPartProps {
  artwork: Artwork;
  tileset: Tileset;
  tile: Tile;
}

interface ShapeEditorProps {
  model: TilesetModel;
  tile: Tile;
  sprite: Sprite;
}

interface ShapeRowProps {
  tile: Tile;
  shape: TileShape;
  index: number;
  selected: boolean;
  layers: readonly string[];
}

interface MixedTextProps {
  label: string;
  value: string | undefined;
  mixed: boolean;
  placeholder?: string;
  disabled?: boolean;
  onCommit: (value: string) => void;
}

interface MixedNumberProps {
  label: string;
  value: number | undefined;
  mixed: boolean;
  min?: number;
  max?: number;
  step?: number;
  onCommit: (value: number) => void;
}

interface MixedChoiceProps {
  label: string;
  value: string | undefined;
  mixed: boolean;
  options: readonly { value: string; label: string }[];
  onCommit: (value: string) => void;
}

interface FieldValueEditorProps {
  field: TileField;
  value: FieldValue | undefined;
  mixed: boolean;
  onChange: (value: FieldValue) => void;
}

interface DataFieldRowProps {
  model: TilesetModel;
  field: TileField;
}

interface ShapeEditorHandle {
  canvas: RefObject<HTMLCanvasElement | null>;
  pointerDown: (event: PointerEvent<HTMLCanvasElement>) => void;
  pointerMove: (event: PointerEvent<HTMLCanvasElement>) => void;
  pointerUp: () => void;
  doubleClick: (event: MouseEvent<HTMLCanvasElement>) => void;
}

interface ShapeDrag {
  kind: 'rect' | 'point';
  from: Point;
  to: Point;
  index: number;
}

interface ZoomChoice {
  zoom: ThumbZoom;
  label: string;
}

export type {
  AnimationPartProps,
  DataFieldRowProps,
  FieldValueEditorProps,
  GridHandlers,
  GridSelection,
  GridView,
  MixedChoiceProps,
  MixedNumberProps,
  MixedTextProps,
  ShapeDrag,
  ShapeEditorHandle,
  ShapeEditorProps,
  ShapeRowProps,
  TileCell,
  TileCellProps,
  TileGridProps,
  TilePaint,
  TerrainContextProps,
  TileThumbProps,
  TilesetModel,
  TilesetModelProps,
  ZoomChoice,
};
