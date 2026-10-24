/* @layer renderer-app @kind component */
import { Box, Icon, Pressable, Text } from '@drizztdourden08/tessera';
import { goToCel } from '../../../timeline/go-to-cel';
import type { LayerRowViewProps } from '../TimelinePanel.type';
import { CelButton } from './CelButton';

const LayerRowView = ({ row, frameId, drag }: LayerRowViewProps) => (
  <Box role="row" className="timeline-grid__row" data-active={row.active ? 'yes' : 'no'}>
    <Pressable
      className="timeline-label"
      role="rowheader"
      data-timeline-zone="cel"
      tabIndex={-1}
      onClick={() => goToCel({ layerId: row.id, frameId })}
    >
      <Text as="span" variant="caption" className="timeline-label__name">{row.name}</Text>
      {!row.visible && <Icon name="eye-off" size={12} />}
      {row.locked && <Icon name="lock" size={12} />}
    </Pressable>
    {row.cells.map((cell) => (
      <CelButton key={cell.frameId} cell={cell} drag={drag} />
    ))}
  </Box>
);

export { LayerRowView };
