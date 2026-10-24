/* @layer renderer-app @kind component */
import { IconButton, Tooltip } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { ONION_TEXT } from '../../../timeline/onion.constants';
import { PixelIcon } from '../../PixelIcon';

const OnionToggle = () => {
  const on = useTimelineStore((state) => state.onion.on);
  const setOnion = useTimelineStore((state) => state.setOnion);
  return (
    <Tooltip content={ONION_TEXT.toggle} placement="top">
      <IconButton label={ONION_TEXT.toggle} size="sm" active={on} aria-pressed={on} onClick={() => setOnion({ on: !on })}>
        <PixelIcon name="onionSkin" />
      </IconButton>
    </Tooltip>
  );
};

export { OnionToggle };
