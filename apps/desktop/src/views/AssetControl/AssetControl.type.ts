/* @layer renderer-app @kind types */
import type { PresetOrigin } from '../../export/preset-entry.type';
import type { BankOption } from '../../palette-bank/palette-bank.type';
import type { PlatformGroup, PlatformReport } from '../../platform-preset/platform-preset.type';
import type { SnapChange } from '../../platform-preset/snap-plan.type';

interface AssetControlProps {
  field: string;
}

interface PairPart {
  key: string;
  label: string;
}

interface PairSpec {
  parts: readonly [PairPart, PairPart];
  joiner: string;
  unit: string;
  min: number;
  max?: number;
  step: number;
}

interface PairControlProps {
  spec: PairSpec;
}

interface PairInputProps {
  spec: PairSpec;
  at: 0 | 1;
}

interface BankControlModel {
  options: readonly BankOption[];
  value: string;
  choose: (bankId: string) => void;
}

interface LimitControlModel {
  count: string;
  change: () => void;
}

interface PlatformControlModel {
  groups: PlatformGroup[];
  value: string;
  unknown: string | null;
  choose: (value: string) => void;
}

interface SnapRowModel {
  changes: readonly SnapChange[];
  banks: number;
  open: boolean;
  begin: () => void;
  cancel: () => void;
  apply: () => void;
}

interface ReportControlModel {
  report: PlatformReport | null;
  caption: string;
  toggleStrict: (on: boolean) => void;
}

interface PresetRowModel {
  key: string;
  name: string;
  detail: string;
  origin: PresetOrigin;
}

interface PresetRowProps {
  row: PresetRowModel;
  onRename: (from: string, to: string) => string | null;
  onRemove: (name: string) => void;
  onRun: (name: string) => void;
}

interface PresetListModel {
  rows: readonly PresetRowModel[];
  rename: (from: string, to: string) => string | null;
  remove: (name: string) => void;
  run: (name: string) => void;
}

export type { AssetControlProps, BankControlModel, PairControlProps, PairInputProps, PairSpec, LimitControlModel, PlatformControlModel, PresetListModel, PresetRowProps, ReportControlModel, SnapRowModel };
