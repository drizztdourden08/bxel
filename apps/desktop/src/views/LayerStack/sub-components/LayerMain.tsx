/* @layer renderer-app @kind component */
import { Box, Pressable, Text } from '@drizztdourden08/tessera';
import { pickHow } from '../../../sheet/pick-how';
import { colourName } from '../behavior/colour-name';
import type { LayerMainProps } from '../LayerStack.type';
import { LayerThumb } from './LayerThumb';

const LayerMain = ({ row, active, picked, tabbable, thumbSize, follow, onPick, onRename }: LayerMainProps) => (
  <Pressable
    className="layer-row__main"
    aria-pressed={picked}
    aria-current={active ? 'true' : undefined}
    tabIndex={tabbable ? 0 : -1}
    onClick={(event) => onPick(pickHow(event) ?? 'replace')}
    onDoubleClick={onRename}
  >
    {row.thumb && thumbSize > 0 && <LayerThumb source={row.thumb} size={thumbSize} follow={follow} />}
    <Box as="span" className="layer-row__text">
      <Text as="span" className="layer-row__name">{row.name}</Text>
      {row.note && <Text as="span" variant="caption" tone="muted" className="layer-row__note">{row.note}</Text>}
    </Box>
    {row.colour && <Box as="span" className="visually-hidden">{`, ${colourName(row.colour)}`}</Box>}
  </Pressable>
);

export { LayerMain };
