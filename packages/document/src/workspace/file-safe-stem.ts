/* @layer core @kind logic */
import { ILLEGAL_FILE_CHARACTERS, MAX_FILE_STEM, RESERVED_FILE_NAMES } from './split.constants';

const fileSafeStem = (name: string, fallback: string): string => {
  const cleaned = name
    .replaceAll(ILLEGAL_FILE_CHARACTERS, '_')
    .replaceAll(/\s+/g, ' ')
    .trim()
    .replace(/^\.+/, '')
    .replace(/[. ]+$/, '')
    .slice(0, MAX_FILE_STEM)
    .trim();
  const stem = cleaned.length > 0 ? cleaned : fallback;
  return RESERVED_FILE_NAMES.test(stem) ? `_${stem}` : stem;
};

export { fileSafeStem };
