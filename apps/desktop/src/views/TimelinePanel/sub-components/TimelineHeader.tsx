/* @layer renderer-app @kind component */
import { Box, Flex } from '@drizztdourden08/tessera';
import type { CompactProps } from '../TimelinePanel.type';
import { FacingControl } from './FacingControl';
import { OnionControl } from './OnionControl';
import { RangeSelect } from './RangeSelect';
import { TimeReadout } from './TimeReadout';
import { TransportButtons } from './TransportButtons';

const TimelineHeader = ({ focus, compact }: CompactProps) => (
  <Flex gap="sm" align="center" className="timeline__header" data-compact={compact ? 'yes' : 'no'}>
    <TransportButtons />
    <Box className="timeline__range">
      <RangeSelect focus={focus} />
    </Box>
    <TimeReadout focus={focus} />
    <Box className="timeline__header-spacer" />
    {!compact && focus.animation.directions !== 'none' && <FacingControl focus={focus} />}
    {!compact && <OnionControl />}
  </Flex>
);

export { TimelineHeader };
