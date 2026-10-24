/* @layer core @kind logic */
import { splitPrefix } from './split-prefix';

const normalizeAbsolute = (path: string): string | undefined => {
  const parts = splitPrefix(path);
  if (!parts) return undefined;
  const kept: string[] = [];
  for (const segment of parts.rest.split('/')) {
    if (segment === '..') {
      if (kept.pop() === undefined) return undefined;
    } else if (segment !== '' && segment !== '.') {
      kept.push(segment);
    }
  }
  return `${parts.prefix}/${kept.join('/')}`;
};

export { normalizeAbsolute };
