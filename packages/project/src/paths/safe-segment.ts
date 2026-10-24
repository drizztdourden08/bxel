/* @layer core @kind logic */
import { isValidSegment } from './is-valid-segment';
import { TRAILING_DOTS_AND_SPACES, UNSAFE_SEGMENT_CHARACTERS, UNSAFE_SEGMENT_START } from './path.constants';

const safeSegment = (text: string, fallback: string, maxLength: number): string => {
  const cleaned = text
    .replace(UNSAFE_SEGMENT_CHARACTERS, '-')
    .replace(UNSAFE_SEGMENT_START, '')
    .slice(0, maxLength)
    .replace(TRAILING_DOTS_AND_SPACES, '');
  return isValidSegment(cleaned) ? cleaned : fallback;
};

export { safeSegment };
