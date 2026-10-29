/* @layer renderer-app @kind logic */
import { BIT_WORDS } from './terrain.constants';

const joinWords = (parts: readonly string[]): string => (parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1) ?? ''}` : (parts[0] ?? ''));

const maskWords = (mask: number): string => {
  const parts = BIT_WORDS.filter(([bit]) => (mask & bit) !== 0).map(([, word]) => word);
  return parts.length === 0 ? 'nothing filled' : `filled ${joinWords(parts)}`;
};

export { maskWords };
