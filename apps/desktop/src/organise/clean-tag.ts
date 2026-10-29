/* @layer renderer-app @kind logic */
import { ORGANISE_LIMITS } from '@bxel/project';
import { CONTROL_CHARACTERS } from './organise.constants';

const cleanTag = (typed: string): string | null => {
  const text = typed.replace(CONTROL_CHARACTERS, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  return text === '' || text.length > ORGANISE_LIMITS.tagMax ? null : text;
};

export { cleanTag };
