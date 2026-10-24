/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera';
import type { LayerGripProps } from '../LayersPanel.type';
import './LayerGrip.css';

const LayerGrip = ({ index, drag }: LayerGripProps) => (
  <Box className="layer-list__grip" aria-hidden {...drag.handlers(index)}>
    <Icon name="grip-vertical" size={14} />
  </Box>
);

export { LayerGrip };
