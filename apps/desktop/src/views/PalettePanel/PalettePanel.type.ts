/* @layer renderer-app @kind types */
import type { Artwork, Ramp, RampId } from '@bxel/document';
import type { MouseButton, ReorderDrag, ShortcutKey } from '@drizztdourden08/tessera';
import type { HTMLAttributes, KeyboardEvent, RefObject } from 'react';
import type { EditorTarget } from '../../editor/editor.type';
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

type PickMode = 'only' | 'toggle' | 'extend';

interface PaletteViewModel extends PaletteViewState {
  change: (next: Partial<PaletteViewState>) => void;
}

interface SelectionModel {
  selected: ReadonlySet<number>;
  focus: number;
  setFocus: (index: number) => void;
  pick: (index: number, mode: PickMode) => void;
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

interface SwatchEditModel {
  index: number | null;
  value: string;
  original: string;
  alpha: number;
  name: string;
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
  target: EditorTarget;
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
  control: GridControl;
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

interface RampRowProps {
  panel: PanelModel;
  ramp: Ramp | null;
  indices: readonly number[];
}

interface RampSwatchProps {
  panel: PanelModel;
  index: number;
  from: RampId | null;
}

interface CellLook {
  selected: boolean;
  hinted: boolean;
  unused: boolean;
  dragging: boolean;
  drop: 'before' | 'after' | undefined;
}

interface CornerMarksProps {
  marks: readonly number[];
}

interface ListRowProps {
  slot: PaletteSlot;
  panel: PanelModel;
  ramps: string;
  active: boolean;
}

interface ChannelSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  stops: readonly string[];
  format: (value: number) => string;
  onChange: (value: number) => void;
}

interface ModelPaneProps {
  value: string;
  onChange: (hex: string) => void;
}

interface GridKeyContext {
  panel: PanelModel;
  index: number;
  total: number;
  columns: number;
  move: (from: number, to: number) => void;
  focus: (index: number, extend: boolean) => void;
}

type PointerHandlers = Partial<Pick<HTMLAttributes<HTMLElement>, 'onPointerDown' | 'onPointerMove' | 'onPointerUp' | 'onPointerCancel'>>;

interface GridControl {
  drag: ReorderDrag;
  pointer: (index: number) => PointerHandlers;
  keyDown: (index: number) => (event: KeyboardEvent<HTMLElement>) => void;
}

type GridKeyAction = (context: GridKeyContext, event: KeyboardEvent<HTMLElement>) => void;

type EditorModel = 'hsv' | 'oklch' | 'rgb';

interface EditorFieldsProps {
  model: EditorModel;
  editor: SwatchEditModel;
}

interface BeforeAfterProps {
  before: string;
  after: string;
  alpha: number;
}

interface SwatchEditorProps {
  panel: PanelModel;
}

export type {
  BeforeAfterProps, CellLook, ChannelSliderProps, CornerMarksProps, EditorFieldsProps, EditorModel, EditSwatch, GridCellProps, GridControl, GridKeyAction, GridKeyContext, HeldChipDef, HeldChipProps, HeldColours, ListColumn, ListHeadProps, ListRowProps, ListSort, ModelPaneProps, PanelModel, PanelProps,
  PaletteViewModel, PickMode, RampDrag, RampRowProps, RampSwatchProps, SelectionModel, SwatchDraft, SwatchEditModel, SwatchEditorProps,
};
