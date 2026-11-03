/* @layer renderer-app @kind component */
import { Icon, IconButton } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { addColour } from '../behavior/add-colour';
import { addReason } from '../behavior/add-reason';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { AddTileProps } from '../PalettePanel.type';

const AddTile = ({ panel, cell, reveal }: AddTileProps) => {
  const reason = addReason(panel);
  const label = reason === '' ? PALETTE_PANEL_TEXT.add : `${PALETTE_PANEL_TEXT.add}. ${reason}`;
  return (
    <ActionHint hint={{ name: PALETTE_PANEL_TEXT.add, description: reason === '' ? PALETTE_PANEL_TEXT.addHint : reason }} placement="top" className="swatch-grid__add">
      <IconButton {...cell} data-tile-look="dashed" label={label} size="xs" variant="secondary" disabled={reason !== ''} onClick={() => addColour(panel, reveal)}>
        <Icon name="plus" size={12} />
      </IconButton>
    </ActionHint>
  );
};

export { AddTile };
