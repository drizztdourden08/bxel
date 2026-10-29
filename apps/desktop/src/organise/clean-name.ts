/* @layer renderer-app @kind logic */
import { ORGANISE_LIMITS } from '@bxel/project';

const CONTROL = /\p{Cc}/gu;

/** A collection or filter name: plain text, single spaces, up to the name limit. */
const cleanName = (typed: string, max: number = ORGANISE_LIMITS.nameMax): string | null => {
  const text = typed.replace(CONTROL, ' ').replace(/\s+/g, ' ').trim();
  return text === '' || text.length > max ? null : text;
};

export { cleanName };
