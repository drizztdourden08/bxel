/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera';
import type { IconName } from '@drizztdourden08/tessera';
import type { LayerRowKind } from '../LayerStack.type';
import type { LayerKindMarkProps } from './LayerKindMark.type';

const iconOf = (kind: LayerRowKind, folded: boolean): IconName => {
  if (kind === 'reference') return 'image';
  return folded ? 'folder' : 'folder-open';
};

const LayerKindMark = ({ kind, folded }: LayerKindMarkProps) => (
  <Box as="span" className="layer-row__kind" aria-hidden>
    <Icon name={iconOf(kind, folded)} size={16} />
  </Box>
);

export { LayerKindMark };
