/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
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

interface PlanActionsProps {
  cancelLabel: string;
  applyLabel: string;
  disabled: boolean;
  onCancel: () => void;
  onApply: () => void;
}

interface PlanDialogProps {
  title: string;
  className: string;
  actions: ReactNode;
  error: string | null;
  failure: string | null;
  onClose: () => void;
  children: ReactNode;
}

export type { ColourRowProps, ImportDialogProps, ImportState, ImportSummaryProps, PlanActionsProps, PlanDialogProps };
