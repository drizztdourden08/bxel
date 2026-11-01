/* @layer renderer-app @kind types */
import type { PaletteTarget } from '../../editor/editor.type';
import type { ImportMode, ImportPlan, ImportSource } from '../../palette-import/palette-import.type';
import type { PaletteImportRequest } from '../../stores/palette-panel-store.type';

interface ImportState {
  source: ImportSource | null;
  text: string;
  mode: ImportMode;
  plan: ImportPlan | null;
  error: string | null;
  failure: string | null;
  setMode: (mode: ImportMode) => void;
  setText: (text: string) => void;
  chooseFile: () => void;
  apply: () => void;
  cancel: () => void;
}

interface ImportDialogProps {
  request: PaletteImportRequest;
  target: PaletteTarget;
}

interface ImportSummaryProps {
  state: ImportState;
  free: number;
}

interface ColourRowProps {
  label: string;
  colours: readonly string[];
}

export type { ColourRowProps, ImportDialogProps, ImportState, ImportSummaryProps };
