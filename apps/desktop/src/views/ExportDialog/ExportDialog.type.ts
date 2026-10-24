/* @layer renderer-app @kind types */
import type { ExportPlan, ExportSettings, IndexedStatus, SavedPreset } from '../../export/export.type';

type ChangeSettings = (patch: Partial<ExportSettings>) => void;

interface FieldsProps {
  settings: ExportSettings;
  change: ChangeSettings;
}

interface FrameFieldsProps extends FieldsProps {
  tags: readonly string[];
}

interface TargetFieldsProps extends FrameFieldsProps {
  sheetLabel: string | null;
  spriteCount: number;
  selectedCount: number;
}

interface ColourFieldProps extends FieldsProps {
  indexed: IndexedStatus;
}

interface DestinationFieldsProps extends FieldsProps {
  placeholder: string;
  onBrowse: () => void;
  onEnter: () => void;
}

interface PresetBarProps {
  presets: readonly SavedPreset[];
  naming: boolean;
  onApply: (name: string) => void;
  onSave: (name: string) => void;
  onDone: () => void;
}

interface PreviewPanelProps {
  plan: ExportPlan;
  source: string | null;
  blocker: string | null;
}

interface ExportActionsProps {
  count: number;
  blocker: string | null;
  running: boolean;
  onSavePreset: () => void;
  onCancel: () => void;
  onExport: () => void;
}

interface DraftModel {
  settings: ExportSettings;
  change: ChangeSettings;
  replace: (settings: ExportSettings) => void;
}

interface PresetModel {
  presets: readonly SavedPreset[];
  apply: (name: string) => void;
  save: (name: string) => void;
}

interface ExportModel {
  draft: DraftModel;
  plan: ExportPlan;
  presets: PresetModel;
  actions: ActionsModel;
  source: string | null;
  blocker: string | null;
  running: boolean;
  spriteCount: number;
  selectedCount: number;
  tags: readonly string[];
  sheetLabel: string | null;
}

interface ExportFieldsProps {
  model: ExportModel;
  onEnter: () => void;
}

interface ActionsModel {
  run: () => void;
  browse: () => void;
}

export type {
  ActionsModel,
  ColourFieldProps,
  DestinationFieldsProps,
  DraftModel,
  ExportActionsProps,
  ExportFieldsProps,
  ExportModel,
  FieldsProps,
  FrameFieldsProps,
  PresetBarProps,
  PresetModel,
  PreviewPanelProps,
  TargetFieldsProps,
};
