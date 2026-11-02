/* @layer renderer-app @kind component */
import { Button } from '@drizztdourden08/tessera';
import { DIALOG_TEXT } from '../../../sheet-manager/manager-text.constants';
import type { CancelApplyProps } from '../CancelApply.type';

const CancelApply = ({ valid, onCancel, onApply }: CancelApplyProps) => (
  <>
    <Button variant="tertiary" onClick={onCancel}>
      {DIALOG_TEXT.cancel}
    </Button>
    <Button variant="primary" disabled={!valid} onClick={onApply}>
      {DIALOG_TEXT.apply}
    </Button>
  </>
);

export { CancelApply };
