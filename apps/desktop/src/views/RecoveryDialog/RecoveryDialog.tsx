/* @layer renderer-app @kind component */
import { Button, DialogShell, Paragraph, formatDate } from '@drizztdourden08/tessera';
import { useRecoveryPrompt } from './behavior/useRecoveryPrompt';
import { RECOVERY_DIALOG_TEXT } from './RecoveryDialog.constants';

const RecoveryDialog = () => {
  const prompt = useRecoveryPrompt();
  const { current } = prompt;
  if (current === null) return null;
  const found = RECOVERY_DIALOG_TEXT.found(current.name ?? RECOVERY_DIALOG_TEXT.unnamed, formatDate(current.savedAt, 'datetime'));
  const actions = (
    <>
      <Button variant="tertiary" onClick={prompt.later}>{RECOVERY_DIALOG_TEXT.later}</Button>
      <Button variant="danger" onClick={prompt.discard}>{RECOVERY_DIALOG_TEXT.discard}</Button>
      <Button variant="primary" onClick={prompt.restore}>{RECOVERY_DIALOG_TEXT.restore}</Button>
    </>
  );
  return (
    <DialogShell open title={RECOVERY_DIALOG_TEXT.title} onClose={prompt.later} actions={actions}>
      <Paragraph tone="dim">{found}</Paragraph>
      {prompt.waiting > 0 && <Paragraph tone="dim">{RECOVERY_DIALOG_TEXT.waiting(prompt.waiting)}</Paragraph>}
    </DialogShell>
  );
};

export { RecoveryDialog };
