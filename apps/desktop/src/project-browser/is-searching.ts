/* @layer renderer-app @kind logic */
import type { BrowserQuery } from './project-browser.type';

const isSearching = (query: BrowserQuery): boolean =>
  query.words.length + query.kinds.length + query.uses.length + query.usedBy.length + query.is.length + query.size.length + query.colours.length > 0 || query.inFolder !== null;

export { isSearching };
