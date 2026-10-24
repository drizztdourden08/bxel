/* @layer renderer-app @kind component */
import { Button } from '@drizztdourden08/tessera';
import { EXPORT_TEXT } from '../../../export/export.constants';
import { EXPORT_DIALOG_TEXT } from '../ExportDialog.constants';
import type { ExportActionsProps } from '../ExportDialog.type';

const ExportActions = ({ count, blocker, running, onSavePreset, onCancel, onExport }: ExportActionsProps) => (
  <>
    <Button variant="tertiary" onClick={onSavePreset}>
      {EXPORT_DIALOG_TEXT.savePreset}
    </Button>
    <Button variant="secondary" onClick={onCancel}>
      {EXPORT_DIALOG_TEXT.cancel}
    </Button>
    <Button variant="primary" disabled={blocker !== null || running} onClick={onExport}>
      {EXPORT_TEXT.button(count)}
    </Button>
  </>
);

export { ExportActions };
