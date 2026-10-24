/* @layer renderer-app @kind types */
import type { BankOption } from '../../palette-bank/palette-bank.type';
import type { SourceGroup } from '../../palette-source/palette-source.type';
import type { PlatformGroup, PlatformReport } from '../../platform-preset/platform-preset.type';
import type { SnapChange } from '../../platform-preset/snap-plan.type';
import type { LoadMode } from '../../swatch-library/swatch-library.type';

interface AssetControlProps {
  field: string;
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

interface SetLoaderModel {
  groups: SourceGroup[];
  value: string;
  empty: boolean;
  choose: (key: string) => void;
  load: (mode: LoadMode) => void;
}

interface PresetRowModel {
  name: string;
  detail: string;
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

export type { AssetControlProps, BankControlModel, LimitControlModel, PlatformControlModel, PresetListModel, PresetRowModel, PresetRowProps, ReportControlModel, SetLoaderModel, SnapRowModel };
