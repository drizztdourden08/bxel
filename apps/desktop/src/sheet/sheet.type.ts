/* @layer renderer-app @kind types */
import type { AnimationId, Artwork, CommandStep, Point, Sheet, SheetId, SheetOverlap, Size, Sprite, SpriteId, TagId } from '@bxel/document';
import type { LockKind } from '../editor/layer-lock.type';
import type { SpriteSettings } from '../stores/sprite-store.type';

type PickHow = 'replace' | 'toggle' | 'range';

type ArrangeKind = 'grid' | 'packed' | 'manual';

interface PickResult {
  selected: readonly SpriteId[];
  anchor: SpriteId | null;
  active: SpriteId | null;
}

interface PickInput {
  order: readonly SpriteId[];
  selected: readonly SpriteId[];
  anchor: SpriteId | null;
  active: SpriteId | null;
  id: SpriteId;
  how: PickHow;
}

interface SpriteScene {
  sprites: readonly Sprite[];
  active: Sprite | null;
  selected: readonly Sprite[];
}

interface SceneModel {
  artwork: Artwork;
  scene: SpriteScene;
}

type SceneInput = Pick<SpriteSettings, 'activeId' | 'selected'>;

interface SheetItem {
  sprite: Sprite;
  at: Point;
  onSheet: boolean;
}

interface SheetAnimationItem {
  animationId: AnimationId;
  tagId: TagId | null;
  name: string;
  at: Point;
  spacing: number;
  images: readonly FrameImage[];
}

interface SheetModel {
  sheet: Sheet | null;
  items: readonly SheetItem[];
  animations: readonly SheetAnimationItem[];
  extent: Size;
  overlaps: readonly SheetOverlap[];
}

interface FrameImage {
  width: number;
  height: number;
  rgba: Uint8ClampedArray<ArrayBuffer>;
}

interface Mismatch {
  spriteId: SpriteId;
  name: string;
  reason: 'layer' | 'size' | 'palette';
}

interface BroadcastCheck {
  ok: readonly Sprite[];
  gaps: readonly Mismatch[];
  total: number;
}

interface MismatchModel {
  text: string;
  layerName: string;
  layerGaps: readonly SpriteId[];
  keep: readonly SpriteId[];
}

interface ScopeChipModel {
  multi: boolean;
  sprites: string;
  layers: string;
}

interface SheetLayerRow {
  name: string;
  carriers: number;
  total: number;
  visible: boolean;
  mixedVisible: boolean;
  lock: LockKind;
  mixedLock: boolean;
  colour: string | null;
}

interface SheetPrelude {
  steps: readonly CommandStep[];
  sheet: SheetId | { ref: string };
}

interface CurrentModel {
  artwork: Artwork;
  model: SheetModel;
}

interface ModelInput {
  artwork: Artwork;
  activeId: SpriteId | null;
  sheetId?: SheetId | null;
}

export type { SheetLayerRow, ArrangeKind, BroadcastCheck, CurrentModel, FrameImage, Mismatch, MismatchModel, ModelInput, PickHow, PickInput, PickResult, ScopeChipModel, SceneInput, SceneModel, SheetAnimationItem, SheetItem, SheetModel, SheetPrelude, SpriteScene };
