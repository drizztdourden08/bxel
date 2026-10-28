/* @layer renderer-app @kind types */
import type { EditorTarget } from '../../editor/editor.type';
import type { SheetPlan } from '../../palette-panel/palette-panel.type';
import type { PaletteSheetRequest } from '../../stores/palette-panel-store.type';

interface SheetState {
  plan: SheetPlan | null;
  error: string | null;
  failure: string | null;
  apply: () => void;
  cancel: () => void;
}

interface SheetDialogProps {
  request: PaletteSheetRequest;
  target: EditorTarget;
}

interface SheetProblemProps {
  error: string | null;
  failure: string | null;
}

interface StripRowProps {
  label: string;
  colours: readonly string[];
}

export type { SheetDialogProps, SheetProblemProps, SheetState, StripRowProps };
