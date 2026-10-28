/* @layer renderer-app @kind component */
import { Box, Icon, IconButton } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { addColour } from '../behavior/add-colour';
import { addReason } from '../behavior/add-reason';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';

const AddTile = ({ panel }: PanelProps) => {
  const reason = addReason(panel);
  const label = reason === '' ? PALETTE_PANEL_TEXT.add : `${PALETTE_PANEL_TEXT.add}. ${reason}`;
  return (
    <ActionHint hint={{ name: PALETTE_PANEL_TEXT.add, description: reason === '' ? PALETTE_PANEL_TEXT.addHint : reason }} placement="top" className="swatch-grid__add">
      <Box className="swatch-grid__add-hit">
        <IconButton label={label} size="xs" variant="secondary" className="swatch-grid__add-button" disabled={reason !== ''} onClick={() => addColour(panel)}>
          <Icon name="plus" size={12} />
        </IconButton>
      </Box>
    </ActionHint>
  );
};

export { AddTile };
