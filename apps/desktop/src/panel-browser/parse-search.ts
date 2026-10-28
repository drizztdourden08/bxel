/* @layer renderer-app @kind logic */
import type { RowKind } from '../asset-list/asset-list.type';
import { EMPTY_QUERY, FILTER_STATES, KIND_WORDS } from './project-browser.constants';
import type { BrowserQuery, ItemState, SearchSplit } from './project-browser.type';

const TOKEN = /^(kind|is|used|in):(.+)$/i;

const adopt = (query: BrowserQuery, name: string, value: string): BrowserQuery | null => {
  const lower = value.toLowerCase();
  if (name === 'kind' && KIND_WORDS[lower] !== undefined) return { ...query, kinds: [...query.kinds, KIND_WORDS[lower] as RowKind] };
  if (name === 'is' && FILTER_STATES.includes(lower as ItemState)) return { ...query, states: [...query.states, lower as ItemState] };
  if (name === 'used') return { ...query, usedBy: value };
  return name === 'in' ? { ...query, inside: lower.replace(/^\/+|\/+$/g, '') } : null;
};

const parseSearch = (text: string): SearchSplit => {
  let query: BrowserQuery = EMPTY_QUERY;
  const rest: string[] = [];
  for (const word of text.split(/\s+/).filter((each) => each !== '')) {
    const parts = TOKEN.exec(word);
    const next = parts === null ? null : adopt(query, (parts[1] ?? '').toLowerCase(), parts[2] ?? '');
    if (next === null) rest.push(word);
    else query = next;
  }
  const joined = rest.join(' ');
  return { query: { ...query, text: joined }, rest: joined };
};

export { parseSearch };
