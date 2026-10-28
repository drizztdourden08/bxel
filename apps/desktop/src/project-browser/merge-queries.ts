/* @layer renderer-app @kind logic */
import type { BrowserQuery } from './project-browser.type';

const merge = <T>(first: readonly T[], second: readonly T[]): readonly T[] => [...new Set([...first, ...second])];

const mergeQueries = (chips: BrowserQuery, typed: BrowserQuery): BrowserQuery => ({
  text: typed.text,
  kinds: merge(chips.kinds, typed.kinds),
  states: merge(chips.states, typed.states),
  usedBy: typed.usedBy ?? chips.usedBy,
  inside: typed.inside ?? chips.inside,
});

export { mergeQueries };
