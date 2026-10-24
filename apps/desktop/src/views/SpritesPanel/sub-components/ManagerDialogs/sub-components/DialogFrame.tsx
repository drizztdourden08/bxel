/* @layer renderer-app @kind component */
import { Button, DialogShell } from '@drizztdourden08/tessera';
import { DIALOG_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../../../stores/useManagerStore';
import type { DialogFrameProps } from '../ManagerDialogs.type';

const DialogFrame = ({ title, canApply, onApply, children }: DialogFrameProps) => {
  const patch = useManagerStore((state) => state.patch);
  const close = (): void => patch({ dialog: null });
  const actions = (
    <>
      <Button variant="tertiary" onClick={close}>
        {DIALOG_TEXT.cancel}
      </Button>
      <Button
        variant="primary"
        disabled={!canApply}
        onClick={() => {
          onApply();
          close();
        }}
      >
        {DIALOG_TEXT.apply}
      </Button>
    </>
  );
  return (
    <DialogShell open title={title} onClose={close} actions={actions}>
      {children}
    </DialogShell>
  );
};

export { DialogFrame };
