/* @layer renderer-app @kind constants */
import type { ComponentType } from 'react';
import type { ManagerDialog } from '../../../../sheet-manager/manager.type';
import type { ManagerModelProps } from '../../SpritesPanel.type';
import { MergeDialog } from './sub-components/MergeDialog';
import { PivotDialog } from './sub-components/PivotDialog';
import { RenameDialog } from './sub-components/RenameDialog';
import { ResizeDialog } from './sub-components/ResizeDialog';
import { SliceDialog } from './sub-components/SliceDialog';
import { SplitDialog } from './sub-components/SplitDialog';

const DIALOG_VIEWS: Readonly<Record<Exclude<ManagerDialog, null>, ComponentType<ManagerModelProps>>> = {
  rename: RenameDialog,
  pivot: PivotDialog,
  resize: ResizeDialog,
  merge: MergeDialog,
  split: SplitDialog,
  slice: SliceDialog,
};

export { DIALOG_VIEWS };
