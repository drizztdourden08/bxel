/* @layer renderer-app @kind logic */
import { ORGANISE_LIMITS } from '@bxel/project';

const CONTROL = /\p{Cc}/gu;

/** A tag is short plain text in lower case with single spaces. Returns null when nothing is left. */
const cleanTag = (typed: string): string | null => {
  const text = typed.replace(CONTROL, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  return text === '' || text.length > ORGANISE_LIMITS.tagMax ? null : text;
};

export { cleanTag };
