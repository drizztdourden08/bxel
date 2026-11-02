/* @layer renderer-app @kind types */
import type { AnimDirection } from '@bxel/document';
import type { LockKind } from '../editor/layer-lock.type';
import type { AlignMode } from '../sheet-manager/align.type';
import type { CreatableKind } from '../stores/creation-store.type';

interface LayerArgs {
  layerId: string;
}

interface LayerLockArgs extends LayerArgs {
  kind: LockKind;
}

interface LayerColourArgs extends LayerArgs {
  colour: string | null;
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

interface TileMoveArgs extends TileArgs {
  direction: 'left' | 'right' | 'up' | 'down';
}

interface TileIndexArgs {
  index: number;
}

interface CollisionKindArgs {
  kind: 'none' | 'full';
}

interface SlotArgs extends TileArgs {
  slot: number;
  action: 'use' | 'add' | 'clear';
  set: string;
}

interface PackingArgs {
  packing: string;
  set: string;
}

interface SetArgs {
  set: string;
}

interface SnapArgs {
  snap: 'pixel' | 'half';
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
  key: string;
  path: string;
  assetId: string;
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

interface UnitArgs {
  unit: string;
}

interface FrameArgs {
  frameId: string;
}

interface DurationOfArgs extends DurationArgs {
  frameIds: string[];
}

interface DurationArgs {
  ms: number;
}

interface TagArgs {
  tagId: string;
  direction: AnimDirection;
  colour: string | null;
}

interface ByColourArgs extends Partial<PixelArgs> {
  index: number;
  mode: 'region' | 'everywhere';
}

export type { AlignArgs, AxisArgs, ByColourArgs, CollisionKindArgs, DurationArgs, DurationOfArgs, FrameArgs, LayerArgs, LayerColourArgs, LayerLockArgs, NameArgs, PackingArgs, PathArgs, PickHereArgs, PixelArgs, ProjectArgs, SetArgs, SheetArgs, SlotArgs, SnapArgs, StatusArgs, SwatchArgs, TabArgs, TagArgs, TileArgs, TileIndexArgs, TileMoveArgs, TraitArgs, UnitArgs, ZoomArgs };
