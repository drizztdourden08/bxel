/* @layer renderer-app @kind component */
import { Grid } from '@drizztdourden08/tessera';
import { HELD_CHIPS, PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { HeldRowProps } from '../PalettePanel.type';
import { HeldChip } from './HeldChip';

const HeldRow = ({ slots, held, onEdit }: HeldRowProps) => (
  <Grid columns={2} gap="xs" role="group" aria-label={PALETTE_PANEL_TEXT.held}>
    {HELD_CHIPS.map((chip) => (
      <HeldChip key={chip.slot} chip={chip} slot={slots[held[chip.slot]]} onEdit={onEdit} />
    ))}
  </Grid>
);

export { HeldRow };
