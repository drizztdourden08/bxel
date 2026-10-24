/* @layer renderer-app @kind component */
import { useState } from 'react';
import { tileUseCounts } from '@bxel/document';
import { Button, Callout, DialogShell, Field, Select, Stack } from '@drizztdourden08/tessera';
import { useMapContext } from '../../../hooks/useMapContext';
import { useTilemapDialogStore } from '../../../stores/useTilemapDialogStore';
import { deleteTile } from '../../../tilemap/delete-tile';
import { TILEMAP_DIALOG_TEXT } from '../TilemapDialog.constants';

const DeleteTileDialog = () => {
  const context = useMapContext();
  const key = useTilemapDialogStore((state) => state.tileKey);
  const hide = useTilemapDialogStore((state) => state.hide);
  const [choice, setChoice] = useState('0');
  const tileset = context?.tileset;
  if (!context || !tileset || key === null) return null;
  const uses = tileUseCounts(context.artwork, tileset.id).get(key) ?? 0;
  const options = [
    { value: '0', label: TILEMAP_DIALOG_TEXT.clearCells },
    ...tileset.tiles.filter((tile) => tile.key !== key).map((tile) => ({ value: String(tile.key), label: TILEMAP_DIALOG_TEXT.replaceWith(tile.key) })),
  ];
  const confirm = (): void => {
    if (deleteTile(key, Number(choice))) hide();
  };
  const actions = (
    <>
      <Button variant="tertiary" onClick={hide}>
        {TILEMAP_DIALOG_TEXT.cancel}
      </Button>
      <Button variant="primary" onClick={confirm}>
        {TILEMAP_DIALOG_TEXT.deleteTile}
      </Button>
    </>
  );
  return (
    <DialogShell open title={TILEMAP_DIALOG_TEXT.deleteTitle} onClose={hide} actions={actions}>
      <Stack gap="md">
        <Callout tone="warning">{TILEMAP_DIALOG_TEXT.deleteWarning(key, uses)}</Callout>
        <Field label={TILEMAP_DIALOG_TEXT.deleteAction}>
          <Select aria-label={TILEMAP_DIALOG_TEXT.deleteAction} value={choice} options={options} onChange={setChoice} />
        </Field>
      </Stack>
    </DialogShell>
  );
};

export { DeleteTileDialog };
