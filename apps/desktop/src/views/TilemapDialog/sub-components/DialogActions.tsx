/* @layer renderer-app @kind component */
import { Button } from '@drizztdourden08/tessera';
import { useTilemapDialogStore } from '../../../stores/useTilemapDialogStore';
import { TILEMAP_DIALOG_TEXT } from '../TilemapDialog.constants';
import type { DialogActionsProps } from '../TilemapDialog.type';

const DialogActions = ({ valid, onCreate }: DialogActionsProps) => {
  const hide = useTilemapDialogStore((state) => state.hide);
  return (
    <>
      <Button variant="tertiary" onClick={hide}>
        {TILEMAP_DIALOG_TEXT.cancel}
      </Button>
      <Button variant="primary" disabled={!valid} onClick={onCreate}>
        {TILEMAP_DIALOG_TEXT.create}
      </Button>
    </>
  );
};

export { DialogActions };
