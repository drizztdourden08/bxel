/* @layer renderer-app @kind component */
import { Box, Pressable } from '@drizztdourden08/tessera';
import { goToCel } from '../../../timeline/go-to-cel';
import { PixelIcon } from '../../PixelIcon';
import type { CelButtonProps } from '../TimelinePanel.type';

const CelButton = ({ cell }: CelButtonProps) => (
  <Box role="gridcell" aria-selected={cell.selected} className="timeline-cel" data-selected={cell.selected ? 'yes' : 'no'}>
    <Pressable
      className="timeline-cel__button"
      aria-label={cell.label}
      tabIndex={cell.current ? 0 : -1}
      data-state={cell.state}
      data-cel-current={cell.current ? 'yes' : 'no'}
      onClick={(event) => goToCel({ layerId: cell.layerId, frameId: cell.frameId }, event.shiftKey)}
    >
      {cell.state === 'linked' && <PixelIcon name="linkedCel" size={16} />}
      {cell.state === 'filled' && <Box className="timeline-cel__dot" aria-hidden />}
    </Pressable>
  </Box>
);

export { CelButton };
