/* @layer renderer-app @kind types */
import type { BankOption } from '../../palette-bank/palette-bank.type';
import type { SourceGroup } from '../../palette-source/palette-source.type';
import type { PlatformReport } from '../../platform-preset/platform-preset.type';
import type { SnapChange } from '../../platform-preset/snap-plan.type';
import type { LoadMode } from '../../swatch-library/swatch-library.type';

interface PlatformRowModel {
  value: string;
  report: PlatformReport | null;
  unknown: string | null;
  strict: boolean;
  choose: (value: string) => void;
  toggleStrict: (on: boolean) => void;
}

interface SnapRowModel {
  changes: readonly SnapChange[];
  banks: number;
  open: boolean;
  begin: () => void;
  cancel: () => void;
  apply: () => void;
}

interface BankRowModel {
  options: readonly BankOption[];
  value: string;
  choose: (bankId: string) => void;
}

interface SetLoaderModel {
  groups: SourceGroup[];
  value: string;
  empty: boolean;
  choose: (key: string) => void;
  load: (mode: LoadMode) => void;
}

interface SettingsDialogProps {
  onClose: () => void;
}

export type { BankRowModel, PlatformRowModel, SetLoaderModel, SettingsDialogProps, SnapRowModel };
