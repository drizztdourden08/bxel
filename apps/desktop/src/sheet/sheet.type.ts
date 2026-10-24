/* @layer renderer-app @kind types */
import type { Artwork, CommandStep, Point, Sheet, SheetId, SheetOverlap, Size, Sprite, SpriteId } from '@bxel/document';
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

interface SheetModel {
  sheet: Sheet | null;
  items: readonly SheetItem[];
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
  frames: string;
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
}

export type { ArrangeKind, BroadcastCheck, CurrentModel, FrameImage, Mismatch, MismatchModel, ModelInput, PickHow, PickInput, PickResult, ScopeChipModel, SceneInput, SceneModel, SheetItem, SheetModel, SheetPrelude, SpriteScene };
