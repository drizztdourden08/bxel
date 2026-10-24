/* @layer renderer-app @kind component */
import { Button } from '@drizztdourden08/tessera';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import type { CreateActionsProps } from '../CreateDialog.type';

const CreateActions = ({ label, valid, onCreate }: CreateActionsProps) => {
  const hide = useCreateDialogStore((state) => state.hide);
  return (
    <>
      <Button variant="tertiary" onClick={hide}>
        {NEW_TEXT.cancel}
      </Button>
      <Button variant="primary" disabled={!valid} onClick={onCreate}>
        {label}
      </Button>
    </>
  );
};

export { CreateActions };
