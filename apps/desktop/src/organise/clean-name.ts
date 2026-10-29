/* @layer renderer-app @kind logic */
import { ORGANISE_LIMITS } from '@bxel/project';
import { CONTROL_CHARACTERS } from './organise.constants';

const cleanName = (typed: string, max: number = ORGANISE_LIMITS.nameMax): string | null => {
  const text = typed.replace(CONTROL_CHARACTERS, ' ').replace(/\s+/g, ' ').trim();
  return text === '' || text.length > max ? null : text;
};

export { cleanName };
