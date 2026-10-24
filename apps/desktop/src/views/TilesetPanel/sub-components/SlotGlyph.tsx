/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { slotGlyph } from '../../../tilemap/terrain/slot-glyph';

const SlotGlyph = ({ mask }: { mask: number }) => (
  <Box className="tileset-panel__glyph" aria-hidden="true">
    {slotGlyph(mask).map((on, at) => (
      <Box key={at} className={on ? 'tileset-panel__glyph-cell tileset-panel__glyph-cell--on' : 'tileset-panel__glyph-cell'} />
    ))}
  </Box>
);

export { SlotGlyph };
