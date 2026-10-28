/* @layer renderer-app @kind logic */
import type { BrowserQuery } from './project-browser.type';

const isQueryEmpty = (query: BrowserQuery): boolean =>
  query.text.trim() === '' && query.kinds.length === 0 && query.states.length === 0 && query.usedBy === null && query.inside === null;

export { isQueryEmpty };
