/* @layer renderer-app @kind component */
import type { Slice } from '@bxel/document';
import { Button, DialogShell } from '@drizztdourden08/tessera';
import { useSliceToolStore } from '../../../stores/useSliceToolStore';
import { useSliceForm } from '../behavior/useSliceForm';
import { SLICE_DIALOG_TEXT } from '../SliceDialog.constants';
import { SliceFields } from './SliceFields';

const SliceContent = ({ slice }: { slice: Slice }) => {
  const hide = useSliceToolStore((state) => state.closeDialog);
  const model = useSliceForm(slice);
  const actions = (
    <>
      <Button variant="tertiary" onClick={hide}>
        {SLICE_DIALOG_TEXT.cancel}
      </Button>
      <Button variant="primary" disabled={!model.valid} onClick={model.apply}>
        {SLICE_DIALOG_TEXT.apply}
      </Button>
    </>
  );
  return (
    <DialogShell open title={SLICE_DIALOG_TEXT.title} onClose={hide} actions={actions}>
      <SliceFields model={model} />
    </DialogShell>
  );
};

export { SliceContent };
