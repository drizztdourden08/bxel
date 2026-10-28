/* @layer renderer-app @kind component */
import { Box, ControlMenu, Icon, IconButton, Tooltip } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { ONION_TEXT } from '../../../timeline/onion.constants';
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

const OnionDiagram = () => {
  const { before, after, on } = useTimelineStore((state) => state.onion);
  const cells = [...Array.from({ length: before }, (_, index) => ({ key: `b${index}`, side: 'before', step: before - index })), { key: 'now', side: 'now', step: 0 }, ...Array.from({ length: after }, (_, index) => ({ key: `a${index}`, side: 'after', step: index + 1 }))];
  return (
    <Box className="onion-diagram" role="img" aria-label={ONION_TEXT.strip} data-on={on ? 'yes' : 'no'}>
      {cells.map((cell) => (
        <Box key={cell.key} className="onion-diagram__cell" data-side={cell.side} data-step={cell.step} />
      ))}
    </Box>
  );
};

export { OnionControl };
