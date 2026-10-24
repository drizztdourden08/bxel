/* @layer renderer-app @kind component */
import { Callout, Stack } from '@drizztdourden08/tessera';
import { useTilemapDialogStore } from '../../../stores/useTilemapDialogStore';
import { FitDialog } from '../../FitDialog';
import { TILEMAP_DIALOG_TEXT } from '../TilemapDialog.constants';
import { useMapForm } from '../behavior/useMapForm';
import { DialogActions } from './DialogActions';
import { MapFields } from './MapFields';

const MapDialog = () => {
  const model = useMapForm();
  const hide = useTilemapDialogStore((state) => state.hide);
  const valid = model.form.name.trim() !== '' && model.form.tilesetId !== null;
  return (
    <FitDialog open title={TILEMAP_DIALOG_TEXT.mapTitle} onClose={hide} actions={<DialogActions valid={valid} onCreate={model.create} />}>
      <Stack gap="md">
        <MapFields model={model} />
        {model.failure !== null && <Callout tone="danger">{model.failure}</Callout>}
      </Stack>
    </FitDialog>
  );
};

export { MapDialog };
