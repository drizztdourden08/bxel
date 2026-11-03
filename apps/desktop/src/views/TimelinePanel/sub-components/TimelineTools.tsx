/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { useAnimationFocus } from '../../../hooks/useAnimationFocus';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { MoreMenu } from './MoreMenu';
import { ZoomControl } from './ZoomControl';

const TimelineTools = () => {
  const focus = useAnimationFocus();
  const compact = useTimelineStore((state) => state.compact);
  if (!focus) return null;
  return (
    <Flex gap="xs" align="center">
      <ZoomControl />
      <MoreMenu focus={focus} compact={compact} />
    </Flex>
  );
};

export { TimelineTools };
