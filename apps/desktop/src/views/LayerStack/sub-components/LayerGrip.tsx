/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera';
import type { LayerGripProps } from '../LayerStack.type';

const LayerGrip = ({ index, drag, disabled }: LayerGripProps) => (
  <Box className="layer-row__grip" aria-hidden data-disabled={disabled ? 'yes' : undefined} {...(disabled ? {} : drag.handlers(index))}>
    <Icon name="grip-vertical" size={14} />
  </Box>
);

export { LayerGrip };
