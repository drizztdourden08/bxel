/* @layer renderer-app @kind constants */
import type { BrowserState } from './EntryBrowser.type';

const BROWSER_START: BrowserState = { query: '', kind: 'all', view: 'grid', zoom: 48 };

const BROWSER_TEXT = {
  search: 'Search',
  views: 'Entry view',
  grid: 'Entries as a grid',
  list: 'Entries as a list',
  size: 'Thumbnail size',
  kinds: { all: 'All', sprites: 'Sprites', animations: 'Animations' },
  noMatch: 'No entry matches.',
  clear: 'Clear search',
  count: (shown: number, total: number): string => (shown === total ? `${total}` : `${shown} of ${total}`),
  picked: (count: number): string => (count === 0 ? '' : `${count} picked`),
  row: (width: number, height: number): string => `${width} by ${height}`,
} as const;

const BROWSER_THUMB = 28;

const ALL_KINDS = ['all', 'sprites', 'animations'] as const;

export { ALL_KINDS, BROWSER_START, BROWSER_TEXT, BROWSER_THUMB };
