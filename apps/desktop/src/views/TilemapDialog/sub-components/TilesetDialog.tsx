/* @layer renderer-app @kind component */
import { Callout, Stack } from '@drizztdourden08/tessera';
import { useTilemapDialogStore } from '../../../stores/useTilemapDialogStore';
import { FitDialog } from '../../FitDialog';
import { TILEMAP_DIALOG_TEXT } from '../TilemapDialog.constants';
import { useTilesetForm } from '../behavior/useTilesetForm';
import { DialogActions } from './DialogActions';
import { TilesetFields } from './TilesetFields';

const TilesetDialog = () => {
  const model = useTilesetForm();
  const hide = useTilemapDialogStore((state) => state.hide);
  const actions = <DialogActions valid={model.form.name.trim() !== ''} onCreate={model.create} />;
  return (
    <FitDialog open title={TILEMAP_DIALOG_TEXT.tilesetTitle} onClose={hide} actions={actions}>
      <Stack gap="md">
        <TilesetFields model={model} />
        {model.failure !== null && <Callout tone="danger">{model.failure}</Callout>}
      </Stack>
    </FitDialog>
  );
};

export { TilesetDialog };
