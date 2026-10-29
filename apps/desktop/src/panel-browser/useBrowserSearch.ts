/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { isSearching } from '../project-browser/is-searching';
import { parseQuery } from '../project-browser/parse-query';
import { MISSING_TOKEN } from './project-browser.constants';
import type { SearchModel } from './browser-state.type';
import { hasToken } from './has-token';
import { toggledToken } from './toggled-token';
import { tokensOf } from './tokens-of';
import { withToken } from './with-token';
import { withoutToken } from './without-token';

const chipTokensOf = (text: string): readonly string[] => [...parseQuery(withoutToken(text, MISSING_TOKEN)).chips.map((chip) => chip.text), ...(hasToken(text, MISSING_TOKEN) ? [MISSING_TOKEN] : [])];

const useBrowserSearch = (): SearchModel => {
  const [typed, setTyped] = useState('');
  const [tokens, setTokens] = useState('');
  const full = `${tokens} ${typed}`;
  const missing = hasToken(full, MISSING_TOKEN);
  const query = useMemo(() => parseQuery(withoutToken(full, MISSING_TOKEN)), [full]);
  const chips = useMemo(() => [...query.chips, ...(missing ? [{ text: MISSING_TOKEN, label: MISSING_TOKEN }] : [])], [query, missing]);

  const setText = useCallback((next: string) => {
    const found = /\s$/.test(next) ? chipTokensOf(next) : [];
    if (found.length === 0) {
      setTyped(next);
      return;
    }
    setTokens((now) => found.reduce((text, token) => withToken(text, token), now));
    setTyped(found.reduce((text, token) => withoutToken(text, token), next));
  }, []);
  const toggle = useCallback((token: string) => setTokens((now) => toggledToken(now, token).trim()), []);
  const remove = useCallback((token: string) => setTokens((now) => withoutToken(now, token)), []);
  const clear = useCallback(() => {
    setTokens('');
    setTyped('');
  }, []);
  return { text: typed, tokens, missing, query, active: isSearching(query) || missing, chips, setText, toggle, remove, clear, count: tokensOf(tokens).length };
};

export { useBrowserSearch };
