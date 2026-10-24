/* @layer renderer-app @kind constants */
import { MANAGER_TEXT } from '../../../../sheet-manager/manager-text.constants';

const ATLAS_LAYOUTS = [
  { value: 'grid', label: MANAGER_TEXT.arrangeGrid },
  { value: 'packed', label: MANAGER_TEXT.arrangePacked },
  { value: 'manual', label: MANAGER_TEXT.arrangeManual },
] as const;

export { ATLAS_LAYOUTS };
