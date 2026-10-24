/* @layer renderer-app @kind types */
import type { Point, Rect, Sheet, Sprite, SpriteId } from '@bxel/document';
import type { ArrangeKind } from '../sheet/sheet.type';

type ManagerTab = 'sprites' | 'atlas';

type ManagerView = 'grid' | 'list';

type SortKey = 'manual' | 'name' | 'size' | 'area' | 'frames';

type ManagerDialog = 'rename' | 'pivot' | 'resize' | null;

interface ManagerFilter {
  animated: boolean;
  unplaced: boolean;
  size: string | null;
}

interface AtlasSettings {
  extrude: number;
  pivots: boolean;
  zoom: number;
  bounds: boolean;
}

interface ListQuery {
  query: string;
  filter: ManagerFilter;
  sortKey: SortKey;
  sortDown: boolean;
}

interface SpriteFacts {
  sprite: Sprite;
  frames: number;
  tags: number;
  slices: number;
  onSheet: boolean;
  sheets: readonly string[];
}

interface RenameSpec {
  pattern: string;
  find: string;
  replace: string;
  start: number;
}

interface RenameEntry {
  id: SpriteId;
  from: string;
  to: string;
  error: string | null;
}

interface RenamePlan {
  entries: readonly RenameEntry[];
  ok: boolean;
  changed: number;
}

type PivotMode =
  | { kind: 'preset'; fx: number; fy: number }
  | { kind: 'exact'; x: number; y: number }
  | { kind: 'first' };

interface PivotPreset {
  id: string;
  label: string;
  fx: number;
  fy: number;
}

type ResizeAnchor = 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';

interface ResizeSpec {
  width: number;
  height: number;
  anchor: ResizeAnchor;
}

interface OrderMove {
  id: SpriteId;
  to: number;
}

interface BandBox extends Rect {
  id: SpriteId;
}

interface AtlasItem {
  id: SpriteId;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pivot: { x2: number; y2: number };
}

interface AtlasModel {
  width: number;
  height: number;
  items: readonly AtlasItem[];
  used: number;
  empty: number;
  failure: string | null;
}

interface AtlasHeld {
  sprite: Sprite;
  at: Point;
}

interface AtlasInput {
  sheet: Sheet;
  sprites: readonly Sprite[];
  extrude: number;
}

interface SheetStyle {
  layout?: ArrangeKind;
  columns?: number;
  maxWidth?: number;
  spacing?: number;
  margin?: number;
}

export type {
  AtlasHeld,
  AtlasInput,
  AtlasItem,
  AtlasModel,
  AtlasSettings,
  BandBox,
  ListQuery,
  ManagerDialog,
  ManagerFilter,
  ManagerTab,
  ManagerView,
  OrderMove,
  PivotMode,
  PivotPreset,
  RenameEntry,
  RenamePlan,
  RenameSpec,
  ResizeAnchor,
  ResizeSpec,
  SheetStyle,
  SortKey,
  SpriteFacts,
};
