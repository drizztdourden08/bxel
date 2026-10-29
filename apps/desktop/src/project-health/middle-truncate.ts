/* @layer renderer-app @kind logic */
import { ELLIPSIS } from './middle-truncate.constants';

const middleTruncate = (text: string, max: number): string => {
  if (text.length <= max) return text;
  const keep = max - ELLIPSIS.length;
  const head = Math.ceil(keep / 2);
  return `${text.slice(0, head)}${ELLIPSIS}${text.slice(text.length - (keep - head))}`;
};

export { middleTruncate };
