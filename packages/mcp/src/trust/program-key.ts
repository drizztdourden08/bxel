/* @layer core @kind logic */
import { PROGRAM_KEY_CONTROL, PROGRAM_KEY_MAX } from './trust.constants';

const programKey = (name: string | null | undefined): string | null => {
  if (!name) return null;
  const key = name.trim().replace(/\s+/g, ' ').toLowerCase();
  if (key.length === 0 || key.length > PROGRAM_KEY_MAX || PROGRAM_KEY_CONTROL.test(key)) return null;
  return key;
};

export { programKey };
