/* @layer renderer-app @kind logic */
import { LOSPEC_BARE, LOSPEC_LINK, LOSPEC_PAGE } from './lospec.constants';

const lospecSlug = (text: string): string | null => {
  const line = text.trim();
  if (line === '' || line.includes('\n')) return null;
  const found = LOSPEC_PAGE.exec(line) ?? LOSPEC_LINK.exec(line);
  if (found) return (found[1] ?? '').toLowerCase();
  return LOSPEC_BARE.test(line) ? line.toLowerCase() : null;
};

export { lospecSlug };
