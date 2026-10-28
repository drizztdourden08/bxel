/* @layer renderer-app @kind component */
import { Box, ControlMenu, Icon, IconButton, Tooltip } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { ONION_TEXT } from '../../../timeline/onion.constants';
import { OnionDiagram } from './OnionDiagram';
import { OnionPanel } from './OnionPanel';

const OnionControl = () => {
  const on = useTimelineStore((state) => state.onion.on);
  const setOnion = useTimelineStore((state) => state.setOnion);
  return (
    <Box className="split-button" role="group" aria-label={ONION_TEXT.toggle}>
      <Tooltip content={`${ONION_TEXT.toggle} (F3)`} placement="top">
        <IconButton label={ONION_TEXT.toggle} size="sm" active={on} aria-pressed={on} onClick={() => setOnion({ on: !on })}>
          <Icon name="pixel-onion-skin" />
        </IconButton>
      </Tooltip>
      <ControlMenu
        size="sm"
        variant="secondary"
        label={ONION_TEXT.settings}
        trigger={{ label: ONION_TEXT.settings, icon: 'chevron-down', iconOnly: true }}
        header={<OnionDiagram />}
      >
        <OnionPanel />
      </ControlMenu>
    </Box>
  );
};

export { OnionControl };
