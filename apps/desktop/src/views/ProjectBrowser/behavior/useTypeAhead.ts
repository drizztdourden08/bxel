/* @layer renderer-app @kind hook */
import type { KeyboardEvent } from 'react';
import { useRef } from 'react';
import type { BrowserModel } from '../../../project-browser/browser-model.type';
import { typeAheadMatch } from '../../../project-browser/type-ahead-match';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import { TYPE_AHEAD_RESET_MS } from '../ProjectBrowser.constants';

const isLetter = (event: KeyboardEvent): boolean => event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== ' ';

const useTypeAhead = (model: BrowserModel) => {
  const typed = useRef({ text: '', at: 0 });
  return (event: KeyboardEvent): boolean => {
    if (!isLetter(event)) return false;
    const now = Date.now();
    const text = now - typed.current.at > TYPE_AHEAD_RESET_MS ? event.key : `${typed.current.text}${event.key}`;
    typed.current = { text, at: now };
    const { selection, select } = useBrowserStore.getState();
    const found = typeAheadMatch(model.entries, text, selection.anchor);
    if (found) select({ ids: [found.id], anchor: found.id });
    return true;
  };
};

export { useTypeAhead };
