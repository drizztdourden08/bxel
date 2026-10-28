/* @layer renderer-app @kind types */
import type { LayerId, MapLayerId } from '@bxel/document';
import type { IconName, MenuGroup } from '@drizztdourden08/tessera';
import type { LayerScope, SpritesScope } from '../stores/sprite-store.type';
import type { Surface } from '../surface/surface.type';

type ChipTone = 'neutral' | 'info' | 'warning' | 'danger';

interface Crumb {
  id: string;
  label: string;
  icon?: IconName;
  title?: string;
  run?: () => void;
  menu?: readonly MenuGroup[];
  note?: 'locked' | 'hidden';
  current?: boolean;
}

interface HeaderAction {
  label: string;
  title?: string;
  pressed?: boolean;
  disabled?: boolean;
  run: () => void;
}

interface HeaderChip {
  id: string;
  text: string;
  tone: ChipTone;
  icon?: IconName;
  title?: string;
  action?: HeaderAction;
}

interface HeaderModel {
  crumbs: readonly Crumb[];
  chips: readonly HeaderChip[];
  actions: readonly HeaderAction[];
}

interface LayerRow {
  id: LayerId;
  name: string;
  state: 'locked' | 'hidden' | '';
  active: boolean;
}

interface SpriteHeader {
  name: string;
  layers: readonly LayerRow[];
  multi: boolean;
  count: number;
  broadcast: boolean;
  canBroadcast: boolean;
  isolated: boolean;
  spritesScope: SpritesScope;
  layerScope: LayerScope;
}

interface AnimationHeader {
  name: string;
  frameAt: number;
  frameCount: number;
  spriteName: string | null;
  shared: boolean;
  notes: readonly string[];
  clip: boolean;
}

interface TileHeader {
  key: number | null;
  uses: number;
}

interface MapHeader {
  mapName: string | null;
  layerId: MapLayerId | null;
  layerName: string | null;
  layerState: 'locked' | 'hidden' | '';
  turn: string | null;
  selection: string | null;
}

interface HeaderInput {
  surface: Surface;
  assetName: string;
  readOnly: boolean;
  hiddenGrids: boolean;
  sprite: SpriteHeader | null;
  animation: AnimationHeader | null;
  sheetSelected: number;
  tile: TileHeader | null;
  map: MapHeader | null;
}

interface HeaderActions {
  back: () => void;
  toggleBroadcast: () => void;
  openSprite: () => void;
  copyFrame: () => void;
  placeTiles: () => void;
  pickLayer: (layerId: LayerId) => void;
  toggleLayerFlag: (flag: 'visible' | 'locked', layerId: LayerId) => void;
  flagMapLayer: (flag: 'visible' | 'locked', layerId: MapLayerId) => void;
  setSpritesScope: (scope: SpritesScope) => void;
  setLayerScope: (scope: LayerScope) => void;
}

export type { AnimationHeader, Crumb, HeaderAction, HeaderActions, HeaderChip, HeaderInput, HeaderModel, LayerRow, MapHeader, SpriteHeader, TileHeader };
