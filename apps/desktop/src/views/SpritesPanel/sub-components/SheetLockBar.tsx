/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useAssistantLine } from '../../../hooks/useAssistantLine';
import { lockMessage } from '../../../sheet-manager/lock-message';

const SheetLockBar = () => {
  const readOnly = useActiveDocument()?.state.readOnly ?? false;
  const assistant = useAssistantLine();
  const message = lockMessage(readOnly, assistant);
  if (message === null) return null;
  return (
    <Text variant="caption" tone="muted" role="status" className="sprites-panel__lock">
      {message}
    </Text>
  );
};

export { SheetLockBar };
