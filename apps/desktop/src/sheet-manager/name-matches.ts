/* @layer renderer-app @kind logic */
import { REGEX_SPECIALS, WILDCARDS } from './name-matches.constants';

const wildcardExpression = (query: string): RegExp => {
  const escaped = query.replace(REGEX_SPECIALS, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`, 'i');
};

const nameMatches = (name: string, query: string): boolean => {
  const wanted = query.trim();
  if (wanted.length === 0) return true;
  if (WILDCARDS.test(wanted)) return wildcardExpression(wanted).test(name);
  return name.toLowerCase().includes(wanted.toLowerCase());
};

export { nameMatches };
