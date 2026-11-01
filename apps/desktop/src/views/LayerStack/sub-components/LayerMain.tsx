/* @layer renderer-app @kind component */
import { Box, Pressable, Text } from '@drizztdourden08/tessera';
import { selectLayerPixels } from '../../../editor/selection/select-layer-pixels';
import { pickHow } from '../../../sheet/pick-how';
import { colourName } from '../behavior/colour-name';
import { layerBadges } from '../behavior/layer-badges';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerMainProps } from '../LayerStack.type';
import { LayerKindMark } from './LayerKindMark';
import { LayerThumb } from './LayerThumb';

const nameOf = (row: LayerMainProps['row']): string => {
  if (row.kind === 'group') return LAYER_STACK_TEXT.groupOf(row.name, row.childCount);
  return row.kind === 'reference' ? LAYER_STACK_TEXT.referenceOf(row.name) : row.name;
};

const LayerMain = ({ row, active, picked, tabbable, thumbSize, follow, folded, onPick, onRename }: LayerMainProps) => (
  <Pressable
    className="layer-row__main"
    aria-pressed={picked}
    aria-current={active ? 'true' : undefined}
    aria-expanded={row.kind === 'group' ? !folded : undefined}
    aria-label={row.kind === 'pixel' ? undefined : nameOf(row)}
    tabIndex={tabbable ? 0 : -1}
    onClick={(event) => {
      if (event.ctrlKey && event.altKey) selectLayerPixels(row.id, event.shiftKey ? 'add' : 'replace');
      else onPick(pickHow(event) ?? 'replace');
    }}
    onDoubleClick={onRename}
  >
    {row.thumb && thumbSize > 0 && <LayerThumb source={row.thumb} size={thumbSize} follow={follow} />}
    {row.kind !== 'pixel' && <LayerKindMark kind={row.kind} folded={folded} />}
    <Box as="span" className="layer-row__text">
      <Text as="span" className="layer-row__name">{row.name}</Text>
      {row.note && <Text as="span" variant="caption" tone="muted" className="layer-row__note">{row.note}</Text>}
    </Box>
    {layerBadges(row).map((badge) => (
      <Text key={badge.id} as="span" variant="caption" tone="muted" className="layer-row__badge" data-badge={badge.id} title={badge.title}>
        {badge.text}
      </Text>
    ))}
    {row.colour && <Box as="span" className="visually-hidden">{`, ${colourName(row.colour)}`}</Box>}
  </Pressable>
);

export { LayerMain };
