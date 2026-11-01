/* @layer renderer-app @kind component */
import { Box, Icon, IconButton } from '@drizztdourden08/tessera';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerFoldProps } from '../LayerStack.type';

const LayerFold = ({ row, folded, onFold }: LayerFoldProps) => (
  <Box as="span" className="layer-row__tree" aria-hidden={row.kind === 'group' ? undefined : true}>
    {row.kind === 'group' && (
      <IconButton
        variant="ghost"
        size="sm"
        label={folded ? LAYER_STACK_TEXT.unfold(row.name) : LAYER_STACK_TEXT.fold(row.name)}
        tabIndex={-1}
        aria-expanded={!folded}
        className="layer-row__fold"
        onClick={() => onFold(row.id)}
      >
        <Icon name={folded ? 'chevron-right' : 'chevron-down'} size={14} />
      </IconButton>
    )}
  </Box>
);

export { LayerFold };
