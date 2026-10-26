/* @layer renderer-app @kind component */
import { Button, DialogShell } from '@drizztdourden08/tessera';
import { ADD_TEXT } from '../../../add-frames/add-frames.constants';
import { useAddFramesStore } from '../../../stores/useAddFramesStore';
import type { AddFramesShellProps } from '../AddFramesDialog.type';

const AddFramesShell = ({ title, canAdd, onAdd, children }: AddFramesShellProps) => {
  const hide = useAddFramesStore((state) => state.hide);
  const actions = (
    <>
      <Button variant="tertiary" onClick={hide}>
        {ADD_TEXT.cancel}
      </Button>
      <Button
        variant="primary"
        disabled={!canAdd}
        onClick={() => {
          onAdd();
          hide();
        }}
      >
        {ADD_TEXT.add}
      </Button>
    </>
  );
  return (
    <DialogShell open title={title} onClose={hide} actions={actions}>
      {children}
    </DialogShell>
  );
};

export { AddFramesShell };
