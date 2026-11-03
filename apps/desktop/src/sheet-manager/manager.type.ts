/* @layer renderer-app @kind types */
import type { Animation, Artwork, Point, Rect, Sheet, Sprite, SpriteId, TagId } from '@bxel/document';
import type { AtlasPlan, ExportSprite } from '@bxel/formats';
import type { Anchor } from '@drizztdourden08/tessera';
import type { Target } from '../export/export.type';
import type { ArrangeKind, FrameImage, SpriteScene } from '../sheet/sheet.type';
import type { IdenticalMode } from './identical.type';

type ManagerView = 'grid' | 'list';

type SortKey = 'manual' | 'name' | 'size' | 'area' | 'bank' | 'created';

type ManagerDialog = 'rename' | 'bank' | 'folder' | 'selection' | 'duplicate' | 'delete' | 'compare' | 'pivot' | 'resize' | 'animate' | 'strip' | 'slice' | 'renameFolder' | null;

type EntryKind = 'all' | 'sprites' | 'animations';

interface ManagerFilter {
  kind: EntryKind;
  slices: boolean;
  size: string | null;
  identical: IdenticalMode;
  tag: string | null;
  bank: string | null;
}

interface AtlasSettings {
  extrude: number;
  trim: boolean;
  powerOfTwo: boolean;
  rotate: boolean;
  pageSide: number;
  page: number;
}

interface ListQuery {
  query: string;
  filter: ManagerFilter;
  sortKey: SortKey;
  sortDown: boolean;
  twins?: ReadonlySet<SpriteId>;
}

interface SpriteFacts {
  kind: 'sprite';
  sprite: Sprite;
  bank: string;
  slices: number;
  strip: number | null;
  at: Point | null;
  onSheet: boolean;
  sheets: readonly string[];
}

interface AnimationFacts {
  kind: 'animation';
  key: string;
  animation: Animation;
  tagId: TagId | null;
  name: string;
  at: Point;
  frames: number;
  durationMs: number;
  bank: string;
  onSheet: boolean;
  sheets: readonly string[];
}

type EntryFacts = SpriteFacts | AnimationFacts;

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

interface ResizeSpec {
  width: number;
  height: number;
  anchor: Anchor;
}

interface OrderMove {
  id: SpriteId;
  to: number;
}

interface AtlasItem {
  id: SpriteId;
  name: string;
  frame: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;
  pivot: { x2: number; y2: number };
  source: Rect;
}

interface AtlasCell {
  frame: number;
  width: number;
  height: number;
  rotated: boolean;
  source: Rect;
}

interface AtlasAnimation {
  name: string;
  x: number;
  y: number;
  spacing: number;
  images: readonly FrameImage[];
  cell?: AtlasCell;
}

interface AtlasModel {
  width: number;
  height: number;
  items: readonly AtlasItem[];
  animations: readonly AtlasAnimation[];
  used: number;
  empty: number;
  failure: string | null;
  page: number;
  pageCount: number;
}

interface AtlasHeld {
  sprite: Sprite;
  at: Point;
  source: Rect;
}

type AtlasPack = Pick<AtlasSettings, 'extrude' | 'trim' | 'powerOfTwo' | 'rotate' | 'pageSide'>;

interface AtlasInput extends AtlasPack {
  sheet: Sheet;
  artwork: Artwork;
  page: number;
}

type AtlasPlanned =
  | { readonly ok: true; readonly targets: readonly Target[]; readonly extra: readonly ExportSprite[]; readonly plan: AtlasPlan }
  | { readonly ok: false; readonly message: string };

interface SheetStyle {
  layout?: ArrangeKind;
  columns?: number;
  maxWidth?: number;
  cellWidth?: number;
  cellHeight?: number;
  spacing?: number;
  margin?: number;
}

interface CurrentManager {
  artwork: Artwork;
  scene: SpriteScene;
  sheet: Sheet | null;
  facts: readonly SpriteFacts[];
  shown: readonly SpriteFacts[];
  animations: readonly AnimationFacts[];
  picked: readonly string[];
  order: readonly SpriteId[];
  ids: readonly SpriteId[];
  sortKey: SortKey;
}

export type {
  AnimationFacts,
  AtlasHeld,
  AtlasInput,
  AtlasAnimation,
  AtlasItem,
  AtlasModel,
  AtlasPack,
  AtlasPlanned,
  AtlasSettings,
  CurrentManager,
  EntryFacts,
  EntryKind,
  ListQuery,
  ManagerDialog,
  ManagerFilter,
  ManagerView,
  OrderMove,
  PivotMode,
  PivotPreset,
  RenameEntry,
  RenamePlan,
  RenameSpec,
  ResizeSpec,
  SheetStyle,
  SortKey,
  SpriteFacts,
};
