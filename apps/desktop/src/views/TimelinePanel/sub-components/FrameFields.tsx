/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { DurationFields } from './DurationFields';
import { OffsetFields } from './OffsetFields';
import { PivotFields } from './PivotFields';

const FrameFields = ({ focus }: FocusProps) => (
  <Flex gap="md" align="center" wrap role="group" aria-label={TIMELINE_TEXT.frameGroup}>
    <DurationFields focus={focus} />
    <OffsetFields focus={focus} />
    <PivotFields focus={focus} />
  </Flex>
);

export { FrameFields };
