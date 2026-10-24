/* @layer renderer-app @kind component */
import { Box, Pressable } from '@drizztdourden08/tessera';
import { celKeyText } from '../../../timeline/cel-key-text';
import { goToCel } from '../../../timeline/go-to-cel';
import { PixelIcon } from '../../PixelIcon';
import type { CelButtonProps } from '../TimelinePanel.type';

const CelButton = ({ cell, drag }: CelButtonProps) => {
  const key = { layerId: cell.layerId, frameId: cell.frameId };
  return (
    <Box
      role="gridcell"
      aria-selected={cell.selected}
      className="timeline-cel"
      data-selected={cell.selected ? 'yes' : 'no'}
      data-drop={drag.over === celKeyText(key) ? 'yes' : undefined}
    >
      <Pressable
        className="timeline-cel__button"
        aria-label={cell.label}
        tabIndex={cell.current ? 0 : -1}
        data-state={cell.state}
        data-timeline-zone="cel"
        data-roving={cell.current ? 'yes' : 'no'}
        data-cel-current={cell.current ? 'yes' : 'no'}
        onClick={(event) => goToCel(key, event.shiftKey, event.ctrlKey || event.metaKey)}
        {...drag.handlers(key, cell.state !== 'empty')}
      >
        {cell.state === 'linked' && <PixelIcon name="linkedCel" size={16} />}
        {cell.state === 'filled' && <Box className="timeline-cel__dot" aria-hidden />}
      </Pressable>
    </Box>
  );
};

export { CelButton };
