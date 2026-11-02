/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import type { LayerTrailProps } from '../LayerStack.type';
import { LayerToggle } from './LayerToggle';

const LayerTrail = ({ row, sweep }: LayerTrailProps) => (
  <Box
    as="span"
    className="layer-row__toggles"
    onClick={(event) => event.stopPropagation()}
    onDoubleClick={(event) => event.stopPropagation()}
  >
    <LayerToggle row={row} flag="visible" sweep={sweep} />
    <LayerToggle row={row} flag="locked" sweep={sweep} />
  </Box>
);

export { LayerTrail };
