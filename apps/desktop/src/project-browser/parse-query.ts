/* @layer renderer-app @kind logic */
import { KIND_ORDER } from '../asset-list/asset-list.constants';
import type { RowKind } from '../asset-list/asset-list.type';
import { EMPTY_QUERY, KIND_ALIAS, QUERY_FLAGS } from './project-browser.constants';
import type { BrowserQuery, Comparison, QueryChange, QueryChip, QueryFlag } from './project-browser.type';

const tokensOf = (text: string): string[] => [...text.matchAll(/(?:[^\s"]*:)?"[^"]*"|\S+/g)].map((match) => match[0]);

const kindOf = (value: string): RowKind | null => {
  const wanted = value.toLowerCase().replace(/s$/, '');
  return KIND_ORDER.find((kind) => kind === wanted) ?? KIND_ALIAS[wanted] ?? null;
};

const operatorOf = (sign: string | undefined): Comparison => {
  if (sign === '<') return 'lt';
  return sign === '>' ? 'gt' : 'eq';
};

const numberQueryChange = (token: string, query: BrowserQuery): QueryChange => {
  const match = /^(size|colou?rs)([<>=])(\d+)$/i.exec(token);
  if (!match) return null;
  const test = { op: operatorOf(match[2]), value: Number(match[3]) };
  return match[1]?.toLowerCase() === 'size' ? { size: [...query.size, test] } : { colours: [...query.colours, test] };
};

const kindQueryChange = (key: string, value: string, query: BrowserQuery): QueryChange => {
  const kind = key === 'kind' ? kindOf(value) : null;
  return kind === null ? null : { kinds: [...query.kinds, kind] };
};

const folderQueryChange = (key: string, value: string): QueryChange => (key === 'in' && value !== '' ? { inFolder: value.replace(/^\/+|\/+$/g, '').toLowerCase() } : null);

const linkQueryChange = (key: string, value: string, query: BrowserQuery): QueryChange => {
  if (value === '') return null;
  if (key === 'uses') return { uses: [...query.uses, value.toLowerCase()] };
  return key === 'usedby' ? { usedBy: [...query.usedBy, value.toLowerCase()] } : null;
};

const flagQueryChange = (key: string, value: string, query: BrowserQuery): QueryChange => {
  const flag = QUERY_FLAGS.find((each: QueryFlag) => each === value.toLowerCase());
  return key === 'is' && flag !== undefined ? { is: [...query.is, flag] } : null;
};

const changeFor = (token: string, query: BrowserQuery): QueryChange => {
  const [head = '', ...rest] = token.split(':');
  const key = head.toLowerCase();
  const value = rest.join(':').replace(/^"|"$/g, '');
  return numberQueryChange(token, query) ?? kindQueryChange(key, value, query) ?? folderQueryChange(key, value) ?? linkQueryChange(key, value, query) ?? flagQueryChange(key, value, query);
};

const chipOf = (token: string): QueryChip => ({ text: token, label: token.replace(/^"|"$/g, '') });

const parseQuery = (text: string): BrowserQuery => {
  let query: BrowserQuery = EMPTY_QUERY;
  const chips: QueryChip[] = [];
  for (const token of tokensOf(text)) {
    const change = changeFor(token, query);
    if (change === null) query = { ...query, words: [...query.words, token.replace(/"/g, '').toLowerCase()] };
    else {
      query = { ...query, ...change };
      chips.push(chipOf(token));
    }
  }
  return { ...query, chips };
};

export { parseQuery };
