/* @layer core @kind logic */
import { isReservedDevice } from './is-reserved-device';
import { PATH_LIMITS, SEGMENT_PATTERN } from './path.constants';

const isValidSegment = (segment: string): boolean =>
  segment.length > 0 &&
  segment.length <= PATH_LIMITS.maxSegmentLength &&
  SEGMENT_PATTERN.test(segment) &&
  !segment.endsWith('.') &&
  !segment.endsWith(' ') &&
  !isReservedDevice(segment);

export { isValidSegment };
