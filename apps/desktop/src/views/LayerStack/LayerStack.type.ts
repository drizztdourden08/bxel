/* @layer renderer-app @kind types */
import type { MouseEvent, PointerEvent } from 'react';
import type { FrameId, Layer, MapLayer, PaletteBank, Sprite } from '@bxel/document';
import type { IconName, ReorderDrag } from '@drizztdourden08/tessera';
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

interface LayerRowModel {
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
  empty: string | null;
  rows: readonly LayerRowModel[];
  activeId: string | null;
  locks: readonly LockKind[];
  maps: readonly MapChoice[];
  mapId: string | null;
  onMap: (id: string) => void;
  frames: number;
  actions: LayerActions;
}

interface ThumbDeps {
  pixels: Uint8Array | Uint32Array | null | undefined;
  bank: object | null;
  width: number;
  height: number;
}

interface LayerBarAction {
  id: string;
  icon: IconName;
  hint: HintSpec;
  run: () => void;
  reason: string | null;
}

interface LayerRowProps {
  row: LayerRowModel;
  index: number;
  total: number;
  active: boolean;
  picked: boolean;
  tabbable: boolean;
  movable: boolean;
  thumbSize: LayerThumbSize;
  drag: ReorderDrag;
  sweep: LayerSweepView;
  model: LayerStackModel;
  onPick: (id: string, how: PickHow) => void;
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
  shown: readonly LayerRowModel[];
  filtered: boolean;
  picked: readonly string[];
  pick: (id: string, how: PickHow) => void;
  thumbSize: LayerThumbSize;
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

interface LayerGripProps {
  index: number;
  drag: ReorderDrag;
  disabled: boolean;
}

interface LayerNameProps {
  name: string;
  onRename: (name: string) => string | null;
  onDone: () => void;
}

interface LayerMainProps {
  row: LayerRowModel;
  active: boolean;
  picked: boolean;
  tabbable: boolean;
  thumbSize: LayerThumbSize;
  follow: boolean;
  onPick: (how: PickHow) => void;
  onRename: () => void;
}

export type {
  LayerBarAction, LayerBarProps, LayerColoursProps, LayerFilterProps, LayerFilterState, LayerGripProps, LayerHeaderProps, LayerListProps, LayerMainProps,
  LayerNameProps, LayerNoMatchProps, LayerRowModel, LayerRowProps, LayerSourceProps, LayerStackModel, LayerStackViewProps, LayerStripProps,
  LayerSweepView, LayerThumbProps, LayerThumbSource, LayerToggleProps, MapChoice, ThumbDeps,
};
