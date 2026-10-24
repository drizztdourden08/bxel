/* @layer renderer-app @kind component */
import { Button, Paragraph } from '@drizztdourden08/tessera';
import { cancelPending } from '../../editor/pending/cancel-pending';
import { commitPending } from '../../editor/pending/commit-pending';
import { usePendingStore } from '../../stores/usePendingStore';
import { FitDialog } from '../FitDialog';
import { TRANSFORM_DIALOG_TEXT, TRANSFORM_DIALOG_TITLES } from './TransformDialog.constants';
import { useTransformDialog } from './behavior/useTransformDialog';
import { DialogFields } from './sub-components/DialogFields';

const TransformDialog = () => {
  const dialog = useTransformDialog();
  const setEditing = usePendingStore((state) => state.setEditing);
  if (!dialog) return null;
  const actions = (
    <>
      <Button variant="tertiary" onClick={cancelPending}>{TRANSFORM_DIALOG_TEXT.cancel}</Button>
      <Button variant="secondary" onClick={() => setEditing(false)}>{TRANSFORM_DIALOG_TEXT.review}</Button>
      <Button variant="primary" disabled={dialog.failed} onClick={commitPending}>{TRANSFORM_DIALOG_TEXT.apply}</Button>
    </>
  );
  return (
    <FitDialog open title={TRANSFORM_DIALOG_TITLES[dialog.spec.kind]} onClose={cancelPending} actions={actions}>
      <DialogFields spec={dialog.spec} />
      <Paragraph tone="dim">{dialog.note}</Paragraph>
    </FitDialog>
  );
};

export { TransformDialog };
