/* @layer renderer-app @kind types */
import type { Artwork, Ramp, RampId } from '@bxel/document';
import type { MouseButton, ReorderDrag, ShortcutKey, VirtualGridCellBind, VirtualGridHandle, VirtualGridProps, VirtualSize } from '@drizztdourden08/tessera';
import type { DragEvent, KeyboardEvent, RefObject } from 'react';
import type { PaletteTarget } from '../../editor/editor.type';
import type { PaletteSlot } from '../../editor/palette-slots.type';
import type { ColourSlot } from '../../editor/press-plan.type';
import type { PaletteLock, PaletteSharing, PaletteUsage } from '../../palette-panel/palette-panel.type';
import type { PaletteViewState } from '../../palette-view/palette-view.type';

interface HeldCombo {
  keys?: readonly ShortcutKey[];
  mouse: MouseButton;
}

interface HeldChipDef {
  slot: ColourSlot;
  position: number;
  draw: HeldCombo;
  pick: HeldCombo;
}

type HeldColours = Readonly<Record<ColourSlot, number>>;

type EditSwatch = (index: number, element: HTMLElement) => void;

interface PaletteDrop {
  over: boolean;
  handlers: {
    onDragOver: (event: DragEvent<HTMLElement>) => void;
    onDragLeave: () => void;
    onDrop: (event: DragEvent<HTMLElement>) => void;
  };
}

type PickMode = 'only' | 'toggle' | 'extend';

interface PaletteViewModel extends PaletteViewState {
  change: (next: Partial<PaletteViewState>) => void;
}

interface SelectionModel {
  selected: ReadonlySet<number>;
  focus: number;
  setFocus: (index: number) => void;
  pick: (index: number, mode: PickMode) => void;
  replace: (keys: readonly string[]) => void;
  all: () => void;
  clear: () => void;
}

interface SwatchDraft {
  index: number;
  value: string;
  alpha: number;
  original: string;
  originalAlpha: number;
  name: string;
}

interface DraftFields {
  index: number | null;
  value: string;
  original: string;
  alpha: number;
  name: string;
}

interface SwatchEditModel extends DraftFields {
  anchor: RefObject<HTMLElement | null>;
  open: EditSwatch;
  change: (hex: string) => void;
  changeAlpha: (alpha: number) => void;
  rename: (name: string) => void;
  reset: () => void;
  cancel: () => void;
  done: () => void;
}

interface PanelModel {
  target: PaletteTarget;
  artwork: Artwork;
  slots: readonly PaletteSlot[];
  held: HeldColours;
  usage: PaletteUsage | null;
  duplicates: readonly (readonly number[])[];
  lock: PaletteLock;
  sharing: PaletteSharing;
  view: PaletteViewModel;
  selection: SelectionModel;
  editor: SwatchEditModel;
  hinted: number | null;
  setHinted: (index: number | null) => void;
  hovered: number | null;
  setHovered: (index: number | null) => void;
}

interface PanelProps {
  panel: PanelModel;
}

interface HeldChipProps {
  chip: HeldChipDef;
  panel: PanelModel;
}

interface GridCellProps {
  slot: PaletteSlot;
  panel: PanelModel;
  cell: VirtualGridCellBind;
}

interface AddTileProps {
  panel: PanelModel;
  cell: VirtualGridCellBind;
  reveal: (index: number) => void;
}

type ListColumn = 'index' | 'name' | 'hex' | 'alpha' | 'use' | 'ramp';

interface ListSort {
  key: ListColumn;
  direction: 'ascending' | 'descending';
}

interface ListHeadProps {
  sort: ListSort;
  onSort: (sort: ListSort) => void;
  showUse: boolean;
}

interface RampDrag {
  index: number;
  from: RampId | null;
}

interface RampReorder {
  listRef: RefObject<HTMLElement | null>;
  drag: ReorderDrag;
  move: (from: number, to: number) => void;
  total: number;
}

interface RampGripProps {
  reorder: RampReorder;
  position: number;
  ramp: Ramp;
}

interface RampRowProps {
  panel: PanelModel;
  ramp: Ramp | null;
  indices: readonly number[];
  reorder?: RampReorder;
  position?: number;
}

interface RampSwatchProps {
  panel: PanelModel;
  index: number;
  from: RampId | null;
}

interface ListRowProps {
  slot: PaletteSlot;
  panel: PanelModel;
  ramps: string;
  active: boolean;
}

interface GridKeyContext {
  panel: PanelModel;
  index: number;
}

type SwatchGridProps = Pick<VirtualGridProps<PaletteSlot>, 'label' | 'getKey' | 'density' | 'tileSize' | 'selection' | 'reorder' | 'onWheelSize' | 'onActiveChange' | 'tileProps'> & { items: readonly PaletteSlot[] };

interface SwatchGridModel {
  handle: RefObject<VirtualGridHandle | null>;
  props: SwatchGridProps;
  reveal: (index: number) => void;
}

type TileSizes = Readonly<Record<PaletteViewState['size'], VirtualSize>>;

type GridKeyAction = (context: GridKeyContext, event: KeyboardEvent<HTMLElement>) => void;

interface SwatchEditorProps {
  panel: PanelModel;
}

export type {
  AddTileProps, DraftFields, EditSwatch, GridCellProps, GridKeyAction, GridKeyContext, HeldChipDef, HeldChipProps, HeldColours, ListColumn, ListHeadProps, ListRowProps, ListSort, PanelModel, PanelProps,
  PaletteDrop, PaletteViewModel, PickMode, RampDrag, RampGripProps, RampReorder, RampRowProps, RampSwatchProps, SelectionModel, SwatchDraft, SwatchEditModel, SwatchEditorProps, SwatchGridModel, SwatchGridProps, TileSizes,
};
