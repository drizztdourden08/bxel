/* @layer renderer-app @kind types */
import type { MouseEvent, PointerEvent } from 'react';
import type { FrameId, Layer, MapLayer, PaletteBank, Sprite } from '@bxel/document';
import type { IconName } from '@drizztdourden08/tessera';
import type { LayerActions } from '../../editor/layer-actions.type';
import type { LayerFlag } from '../../editor/layer-flag.type';
import type { LockKind } from '../../editor/layer-lock.type';
import type { LayerScopeChip, LayerThumbSize } from '../../stores/layer-view-store.type';
import type { PickHow } from './behavior/pick-layer.type';
import type { HintSpec } from '../ActionHint';

type LayerStackKind = 'sprite' | 'map' | 'sheet';

interface SpriteThumbSource {
  kind: 'sprite';
  sprite: Sprite;
  bank: PaletteBank;
  layer: Layer;
  frameId: FrameId;
}

interface MapThumbSource {
  kind: 'map';
  layer: MapLayer;
  columns: number;
  rows: number;
}

type LayerThumbSource = SpriteThumbSource | MapThumbSource;

type LayerRowKind = 'pixel' | 'group' | 'reference';

interface LayerRowTree {
  kind: LayerRowKind;
  depth: number;
  parentId: string | null;
  childCount: number;
  viewOpacity: number;
  clip: boolean;
  exported: boolean;
  missing: boolean;
}

interface LayerRowModel extends LayerRowTree {
  id: string;
  name: string;
  visible: boolean;
  mixedVisible: boolean;
  lock: LockKind;
  mixedLock: boolean;
  colour: string | null;
  note: string | null;
  thumb: LayerThumbSource | null;
}

interface MapChoice {
  value: string;
  label: string;
}

interface LayerStackModel {
  kind: LayerStackKind;
  owner: string;
  ownerMeta: string | null;
  empty: string | null;
  rows: readonly LayerRowModel[];
  activeId: string | null;
  locks: readonly LockKind[];
  maps: readonly MapChoice[];
  mapId: string | null;
  onMap: (id: string) => void;
  frames: number;
  tileScope?: boolean;
  actions: LayerActions;
}

interface LayerBarAction {
  id: string;
  icon: IconName;
  hint: HintSpec;
  run: () => void;
  reason: string | null;
}

type LayerSweepHandlers = {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerEnter: () => void;
  onClick: (event: MouseEvent<HTMLElement>) => void;
};

interface LayerSweepView {
  pending: (id: string, flag: LayerFlag) => boolean | undefined;
  handlers: (row: LayerRowModel, flag: LayerFlag) => LayerSweepHandlers;
}

interface LayerFilterState {
  active: boolean;
  filtered: boolean;
  shown: readonly LayerRowModel[];
  text: string;
  colour: string | null;
  setText: (text: string) => void;
  setColour: (colour: string | null) => void;
  clear: () => void;
}

interface LayerSourceProps {
  thumbSize: LayerThumbSize;
  onThumbSize: (size: LayerThumbSize) => void;
}

interface LayerStackViewProps extends LayerSourceProps {
  model: LayerStackModel;
}

interface LayerListProps {
  model: LayerStackModel;
  rows: readonly LayerRowModel[];
  filtered: boolean;
  picked: readonly string[];
  pick: (id: string, how: PickHow) => void;
  pickKeys: (keys: ReadonlySet<string>) => void;
  thumbSize: LayerThumbSize;
}

interface LayerTrailProps {
  row: LayerRowModel;
  sweep: LayerSweepView;
  onAddMissing?: () => void;
}

interface LayerHeaderProps extends LayerSourceProps {
  model: LayerStackModel;
  shown: number;
}

interface LayerStripProps {
  model: LayerStackModel;
  picked: readonly string[];
  scope: LayerScopeChip;
  onScope: (scope: LayerScopeChip) => void;
}

interface LayerColoursProps {
  value: string | null;
  label: string;
  onPick: (colour: string | null) => void;
}

interface LayerFilterProps {
  text: string;
  colour: string | null;
  onText: (text: string) => void;
  onColour: (colour: string | null) => void;
}

interface LayerBarProps {
  model: LayerStackModel;
  picked: readonly string[];
}

interface LayerNoMatchProps {
  onClear: () => void;
}

interface LayerThumbProps {
  source: LayerThumbSource;
  size: number;
  follow: boolean;
}

interface LayerToggleProps {
  row: LayerRowModel;
  flag: LayerFlag;
  sweep: LayerSweepView;
}

interface StripMixed {
  lock: boolean;
  opacity: boolean;
  clip: boolean;
  exported: boolean;
}

interface LayerViewControlsProps {
  model: LayerStackModel;
  picked: readonly string[];
  lead: LayerRowModel;
  mixed: StripMixed;
}

interface LayerNameProps {
  name: string;
  onRename: (name: string) => string | null;
  onDone: () => void;
}

export type {
  LayerBarAction, LayerBarProps, LayerColoursProps, LayerFilterProps, LayerFilterState, LayerViewControlsProps, LayerHeaderProps, LayerListProps,
  LayerNameProps, LayerNoMatchProps, LayerRowKind, LayerRowModel, LayerRowTree, LayerSourceProps, LayerStackModel, LayerStackViewProps, LayerStripProps,
  LayerSweepView, StripMixed, LayerThumbProps, LayerThumbSource, LayerToggleProps, LayerTrailProps, MapChoice,
};
