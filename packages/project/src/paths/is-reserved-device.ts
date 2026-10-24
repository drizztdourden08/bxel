/* @layer core @kind logic */
import { RESERVED_DEVICE_PATTERN } from './path.constants';

const isReservedDevice = (segment: string): boolean => {
  const stem = segment.split('.')[0] ?? '';
  return RESERVED_DEVICE_PATTERN.test(stem.trimEnd());
};

export { isReservedDevice };
