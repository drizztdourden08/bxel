/* @layer renderer-app @kind component */
import { FloatingPrompt } from '@drizztdourden08/tessera';
import { cancelPending } from '../../editor/pending/cancel-pending';
import { commitPending } from '../../editor/pending/commit-pending';
import { APPLY_BAR_TEXT } from './ApplyBar.constants';
import { applyMessage } from './behavior/apply-message';
import { useApplyBar } from './behavior/useApplyBar';
import { useNudgeKeys } from './behavior/useNudgeKeys';

const ApplyBar = () => {
  const bar = useApplyBar();
  useNudgeKeys(bar !== null);
  return (
    <FloatingPrompt
      open={bar !== null}
      label={APPLY_BAR_TEXT.region}
      variant={bar?.error == null ? 'info' : 'danger'}
      message={bar === null ? '' : applyMessage(bar)}
      actions={[
        { id: 'apply', label: APPLY_BAR_TEXT.apply, variant: 'primary', disabled: bar?.error != null, onSelect: commitPending },
        { id: 'cancel', label: APPLY_BAR_TEXT.cancel, cancel: true, onSelect: cancelPending },
      ]}
    />
  );
};

export { ApplyBar };
