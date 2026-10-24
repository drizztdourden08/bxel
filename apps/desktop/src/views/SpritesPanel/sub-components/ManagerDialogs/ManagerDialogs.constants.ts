/* @layer renderer-app @kind constants */
import { COMPOSE_TEXT } from '../../../../sheet-manager/compose-text.constants';
import { COPY_TEXT } from '../../../../sheet-manager/copy-text.constants';
import { DEFAULT_PATTERN, FIRST_NUMBER } from '../../../../sheet-manager/manager.constants';
import type { RenameSpec } from '../../../../sheet-manager/manager.type';
import { DIALOG_TEXT } from '../../../../sheet-manager/manager-text.constants';
import type { PivotFormState } from './ManagerDialogs.type';

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

export { DUPLICATE_START, PIVOT_KINDS, PIVOT_START, PREVIEW_ROWS, RENAME_START, SLICE_KINDS };
