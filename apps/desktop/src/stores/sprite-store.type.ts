/* @layer renderer-app @kind types */
import type { SpriteId } from '@bxel/document';

type SpriteMode = 'sprite' | 'sheet' | 'tilemap';

type LayerScope = 'active' | 'visible' | 'all';

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
  setGap: (layerName: string | null) => void;
  setSliceDraw: (on: boolean) => void;
  setRenaming: (spriteId: SpriteId | null) => void;
}

export type { LayerScope, SpriteMode, SpriteSettings, SpriteState, SpritesScope };
