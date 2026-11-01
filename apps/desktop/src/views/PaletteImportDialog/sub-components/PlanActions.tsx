/* @layer renderer-app @kind component */
import { Button } from '@drizztdourden08/tessera';
import type { PlanActionsProps } from '../PaletteImportDialog.type';

const PlanActions = ({ cancelLabel, applyLabel, disabled, onCancel, onApply }: PlanActionsProps) => (
  <>
    <Button variant="tertiary" onClick={onCancel}>
      {cancelLabel}
    </Button>
    <Button variant="primary" disabled={disabled} onClick={onApply}>
      {applyLabel}
    </Button>
  </>
);

export { PlanActions };
