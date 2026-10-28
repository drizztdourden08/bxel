/* @layer renderer-app @kind logic */
import type { RowKind } from '../asset-list/asset-list.type';
import { KIND_ORDER } from '../asset-list/asset-list.constants';
import type { BrowserQuery, Comparison, NumberTest, QueryChip, QueryFlag } from './project-browser.type';

const FLAGS: readonly QueryFlag[] = ['unused', 'unsaved', 'open', 'pinned'];

const KIND_ALIAS: Readonly<Record<string, RowKind>> = { map: 'tilemap', tiles: 'tileset', anim: 'animation', atlas: 'sheet', png: 'image', gif: 'image', bmp: 'image' };

const EMPTY_QUERY: BrowserQuery = { words: [], kinds: [], inFolder: null, uses: [], usedBy: [], is: [], size: [], colours: [], chips: [] };

const tokensOf = (text: string): string[] => [...text.matchAll(/"([^"]*)"|(\S+)/g)].map((match) => match[1] ?? match[2] ?? '').filter((token) => token !== '');

const kindOf = (value: string): RowKind | null => {
  const wanted = value.toLowerCase().replace(/s$/, '');
  return KIND_ORDER.find((kind) => kind === wanted) ?? KIND_ALIAS[wanted] ?? null;
};

const numberTest = (token: string): { field: 'size' | 'colours'; test: NumberTest } | null => {
  const match = /^(size|colou?rs)([<>=])(\d+)$/i.exec(token);
  if (!match) return null;
  const op: Comparison = match[2] === '<' ? 'lt' : match[2] === '>' ? 'gt' : 'eq';
  return { field: match[1]?.toLowerCase() === 'size' ? 'size' : 'colours', test: { op, value: Number(match[3]) } };
};

const chip = (token: string): QueryChip => ({ text: token, label: token.replace(/^"|"$/g, '') });

const parseQuery = (text: string): BrowserQuery => {
  let query: BrowserQuery = EMPTY_QUERY;
  const chips: QueryChip[] = [];
  const add = (change: Partial<BrowserQuery>, token: string): void => {
    query = { ...query, ...change };
    chips.push(chip(token));
  };
  for (const token of tokensOf(text)) {
    const [head = '', ...rest] = token.split(':');
    const value = rest.join(':');
    const tested = numberTest(token);
    const key = head.toLowerCase();
    if (tested) add({ [tested.field]: [...query[tested.field], tested.test] }, token);
    else if (key === 'kind' && kindOf(value)) add({ kinds: [...query.kinds, kindOf(value) as RowKind] }, token);
    else if (key === 'in' && value !== '') add({ inFolder: value.replace(/^\/+|\/+$/g, '').toLowerCase() }, token);
    else if (key === 'uses' && value !== '') add({ uses: [...query.uses, value.toLowerCase()] }, token);
    else if (key === 'usedby' && value !== '') add({ usedBy: [...query.usedBy, value.toLowerCase()] }, token);
    else if (key === 'is' && FLAGS.some((flag) => flag === value.toLowerCase())) add({ is: [...query.is, value.toLowerCase() as QueryFlag] }, token);
    else query = { ...query, words: [...query.words, token.toLowerCase()] };
  }
  return { ...query, chips };
};

/** A query with nothing in it shows the folder; anything in it searches the whole project. */
const isSearching = (query: BrowserQuery): boolean =>
  query.words.length + query.kinds.length + query.uses.length + query.usedBy.length + query.is.length + query.size.length + query.colours.length > 0 || query.inFolder !== null;

export { isSearching, parseQuery };
