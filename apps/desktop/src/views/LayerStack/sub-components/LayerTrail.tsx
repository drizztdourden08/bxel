/* @layer renderer-app @kind component */
import { Box, Icon, IconButton } from '@drizztdourden08/tessera';
import { ActionHint } from '../../ActionHint';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerTrailProps } from '../LayerStack.type';
import { LayerToggle } from './LayerToggle';

const LayerTrail = ({ row, sweep, onAddMissing }: LayerTrailProps) => (
  <Box
    as="span"
    className="layer-row__toggles"
    onClick={(event) => event.stopPropagation()}
    onDoubleClick={(event) => event.stopPropagation()}
  >
    {onAddMissing && (
      <ActionHint hint={{ name: LAYER_STACK_TEXT.addMissing, description: LAYER_STACK_TEXT.addMissingHint }}>
        <IconButton variant="ghost" size="sm" label={LAYER_STACK_TEXT.addMissing} tabIndex={-1} className="layer-row__toggle" onClick={onAddMissing}>
          <Icon name="plus" size={16} />
        </IconButton>
      </ActionHint>
    )}
    <LayerToggle row={row} flag="visible" sweep={sweep} />
    <LayerToggle row={row} flag="locked" sweep={sweep} />
  </Box>
);

export { LayerTrail };
