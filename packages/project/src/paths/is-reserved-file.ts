/* @layer core @kind logic */
import { MANIFEST_SUFFIX, TEMPORARY_MARKER, TRAILING_DOTS_AND_SPACES } from './path.constants';

const isReservedFile = (name: string): boolean => {
  const lower = name.toLowerCase().replace(TRAILING_DOTS_AND_SPACES, '');
  return lower.startsWith('.') || lower.endsWith(MANIFEST_SUFFIX) || lower.includes(TEMPORARY_MARKER);
};

export { isReservedFile };
