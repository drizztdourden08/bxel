/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { isQueryEmpty } from './is-query-empty';
import { mergeQueries } from './merge-queries';
import { parseSearch } from './parse-search';
import { EMPTY_QUERY } from './project-browser.constants';
import type { BrowserQuery, BrowserQueryState, ItemState } from './project-browser.type';
import type { RowKind } from '../asset-list/asset-list.type';

const toggled = <T>(list: readonly T[], value: T): readonly T[] => (list.includes(value) ? list.filter((each) => each !== value) : [...list, value]);

const useBrowserQuery = (): BrowserQueryState => {
  const [search, setText] = useState('');
  const [chips, setChips] = useState<BrowserQuery>(EMPTY_QUERY);
  const typed = useMemo(() => parseSearch(search).query, [search]);
  const query = useMemo(() => mergeQueries(chips, typed), [chips, typed]);

  const setSearch = useCallback((text: string) => {
    const split = parseSearch(text);
    const found = !isQueryEmpty({ ...split.query, text: '' });
    if (/\s$/.test(text) && found) {
      setChips((now) => mergeQueries(now, split.query));
      setText(split.rest);
    } else setText(text);
  }, []);
  const toggleKind = useCallback((kind: RowKind) => setChips((now) => ({ ...now, kinds: toggled(now.kinds, kind) })), []);
  const toggleState = useCallback((state: ItemState) => setChips((now) => ({ ...now, states: toggled(now.states, state) })), []);
  const setUsedBy = useCallback((usedBy: string | null) => setChips((now) => ({ ...now, usedBy })), []);
  const setInside = useCallback((inside: string | null) => setChips((now) => ({ ...now, inside })), []);
  const clear = useCallback(() => {
    setChips(EMPTY_QUERY);
    setText('');
  }, []);

  return { search, chips, query, setSearch, toggleKind, toggleState, setUsedBy, setInside, clear };
};

export { useBrowserQuery };
