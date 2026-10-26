/* @layer renderer-app @kind types */
import type { AlignMode } from '../sheet-manager/align.type';
import type { CreatableKind } from '../stores/creation-store.type';

interface LayerArgs {
  layerId: string;
}

interface SwatchArgs {
  index: number;
  slot: number;
}

interface PixelArgs {
  x: number;
  y: number;
}

interface PickHereArgs extends PixelArgs {
  slot: number;
}

interface TileArgs {
  key: number;
}

interface PathArgs {
  path: string;
  tabId: string;
}

interface TabArgs {
  tabId: string;
}

interface ZoomArgs {
  percent: number;
}

interface StatusArgs {
  item: string;
}

interface ProjectArgs {
  rowId: string;
  name: string;
  kind: CreatableKind;
}

interface AlignArgs {
  mode: AlignMode;
}

interface SheetArgs {
  sheetId: string;
}

interface NameArgs {
  name: string;
}

interface TraitArgs {
  kind: 'tag' | 'size' | 'bank';
  value: string;
}

interface AxisArgs {
  axis: 'x' | 'y';
  position: number;
}

interface ByColourArgs extends Partial<PixelArgs> {
  index: number;
  mode: 'region' | 'everywhere';
}

export type { AlignArgs, AxisArgs, ByColourArgs, LayerArgs, NameArgs, PathArgs, PickHereArgs, PixelArgs, ProjectArgs, SheetArgs, StatusArgs, SwatchArgs, TabArgs, TileArgs, TraitArgs, ZoomArgs };
