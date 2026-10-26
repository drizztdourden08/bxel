/* @layer renderer-app @kind constants */
import type { ComponentType } from 'react';
import { COMPOSE_TEXT } from '../../../../sheet-manager/compose-text.constants';
import { COPY_TEXT } from '../../../../sheet-manager/copy-text.constants';
import { DEFAULT_PATTERN, FIRST_NUMBER } from '../../../../sheet-manager/manager.constants';
import type { ManagerDialog, RenameSpec } from '../../../../sheet-manager/manager.type';
import { DIALOG_TEXT } from '../../../../sheet-manager/manager-text.constants';
import type { ManagerModelProps } from '../../SpritesPanel.type';
import type { PivotFormState } from './ManagerDialogs.type';
import { BankDialog } from './sub-components/BankDialog';
import { CompareDialog } from './sub-components/CompareDialog';
import { DeleteDialog } from './sub-components/DeleteDialog';
import { DuplicateDialog } from './sub-components/DuplicateDialog';
import { FolderDialog } from './sub-components/FolderDialog';
import { AnimateDialog } from './sub-components/AnimateDialog';
import { CutStripDialog } from './sub-components/CutStripDialog';
import { PivotDialog } from './sub-components/PivotDialog';
import { RenameDialog } from './sub-components/RenameDialog';
import { ResizeDialog } from './sub-components/ResizeDialog';
import { SelectionDialog } from './sub-components/SelectionDialog';
import { SliceDialog } from './sub-components/SliceDialog';

const RENAME_START: RenameSpec = { pattern: DEFAULT_PATTERN, find: '', replace: '', start: FIRST_NUMBER };

const DUPLICATE_START: RenameSpec = { pattern: `{name}${COPY_TEXT.suffix}`, find: '', replace: '', start: FIRST_NUMBER };

const PIVOT_START: PivotFormState = { kind: 'preset', preset: 'center', x: 0, y: 0 };

const PIVOT_KINDS = [
  { value: 'preset', label: DIALOG_TEXT.pivotPreset },
  { value: 'exact', label: DIALOG_TEXT.pivotExact },
  { value: 'first', label: DIALOG_TEXT.pivotFirst },
] as const;

const SLICE_KINDS = [
  { value: 'count', label: COMPOSE_TEXT.byCount },
  { value: 'size', label: COMPOSE_TEXT.bySize },
] as const;

const PREVIEW_ROWS = 8;

const COMPARE_BOX = 128;

const DIALOG_VIEWS: Readonly<Record<Exclude<ManagerDialog, null>, ComponentType<ManagerModelProps>>> = {
  rename: RenameDialog,
  bank: BankDialog,
  folder: FolderDialog,
  selection: SelectionDialog,
  duplicate: DuplicateDialog,
  delete: DeleteDialog,
  compare: CompareDialog,
  pivot: PivotDialog,
  resize: ResizeDialog,
  animate: AnimateDialog,
  strip: CutStripDialog,
  slice: SliceDialog,
};

export { COMPARE_BOX, DIALOG_VIEWS, DUPLICATE_START, PIVOT_KINDS, PIVOT_START, PREVIEW_ROWS, RENAME_START, SLICE_KINDS };
