/* @layer renderer-app @kind types */
import type { SpriteId } from '@bxel/document';

type SpriteMode = 'sprite' | 'sheet';

type LayerScope = 'active' | 'visible' | 'all';

type FrameScope = 'current' | 'all';

type SpritesScope = 'selected' | 'current';

interface SpriteSettings {
  mode: SpriteMode;
  activeId: SpriteId | null;
  selected: readonly SpriteId[];
  anchor: SpriteId | null;
  broadcast: boolean;
  isolated: boolean;
  spritesScope: SpritesScope;
  layerScope: LayerScope;
  frameScope: FrameScope;
  gap: string | null;
  sliceDraw: boolean;
  renamingId: SpriteId | null;
}

interface SpriteState extends SpriteSettings {
  reset: () => void;
  setMode: (mode: SpriteMode, isolated?: boolean) => void;
  setActive: (activeId: SpriteId | null) => void;
  setSelection: (selected: readonly SpriteId[], anchor: SpriteId | null) => void;
  setBroadcast: (broadcast: boolean) => void;
  setSpritesScope: (scope: SpritesScope) => void;
  setLayerScope: (scope: LayerScope) => void;
  setFrameScope: (scope: FrameScope) => void;
  setGap: (layerName: string | null) => void;
  setSliceDraw: (on: boolean) => void;
  setRenaming: (spriteId: SpriteId | null) => void;
}

export type { FrameScope, LayerScope, SpriteMode, SpriteSettings, SpriteState, SpritesScope };
