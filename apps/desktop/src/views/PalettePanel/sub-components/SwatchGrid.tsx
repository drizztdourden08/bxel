/* @layer renderer-app @kind component */
import { Grid } from '@drizztdourden08/tessera';
import { swatchMarks } from '../../../editor/swatch-marks';
import { swatchSlot } from '../../../editor/swatch-slot';
import { useToolStore } from '../../../stores/useToolStore';
import { PALETTE_PANEL_TEXT, SWATCH_MIN_WIDTH } from '../PalettePanel.constants';
import type { SwatchGridProps } from '../PalettePanel.type';
import { PaletteSwatch } from './PaletteSwatch';

const SwatchGrid = ({ slots, held, onEdit }: SwatchGridProps) => (
  <Grid minColWidth={SWATCH_MIN_WIDTH} gap="2xs" role="group" aria-label={PALETTE_PANEL_TEXT.grid}>
    {slots.map((slot) => (
      <PaletteSwatch
        key={slot.index}
        slot={slot}
        marks={swatchMarks(slot.index, held)}
        onPick={(index, click) => useToolStore.getState().setColour(swatchSlot(click), index)}
        onEdit={onEdit}
      />
    ))}
  </Grid>
);

export { SwatchGrid };
