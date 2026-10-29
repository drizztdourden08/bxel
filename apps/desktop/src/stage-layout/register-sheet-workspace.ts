/* @layer renderer-app @kind logic */
import { registerWorkspaces } from '@drizztdourden08/brock-react';
import { SHEET_WORKSPACE } from './sheet-workspace.constants';

const registerSheetWorkspace = (): (() => void) => registerWorkspaces([SHEET_WORKSPACE]);

export { registerSheetWorkspace };
