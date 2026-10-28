/* @layer renderer-app @kind hook */
import type { KeyboardEvent } from 'react';
import { pickAll } from '../../../project-browser/selection';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import type { BrowserModel } from '../../../project-browser/browser-model.type';
import type { BrowserActions } from '../ProjectBrowser.type';

const typing = (event: KeyboardEvent): boolean => event.target instanceof HTMLElement && (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA');

/** The keys of the Browse page. They act on the selection; a field that is being typed in keeps its own keys. */
const useBrowserKeys = (model: BrowserModel, actions: BrowserActions) => (event: KeyboardEvent): void => {
  if (typing(event)) return;
  const mod = event.ctrlKey || event.metaKey;
  const store = useBrowserStore.getState();
  const [only] = model.selected;
  const handled = ((): boolean => {
    if (event.key === 'F2' && model.editable && model.selected.length === 1 && only) return (actions.startRename(only.id), true);
    if (event.key === 'Delete' && model.editable && model.selected.length > 0) return (actions.trash(model.selected), true);
    if (event.key === 'Enter' && event.altKey && model.selected.length > 0) return (actions.properties(model.selected), true);
    if (event.key === 'Enter' && only && model.selected.length === 1) return (actions.open(only), true);
    if (event.key === 'Enter' && model.selected.length > 1) return (actions.openAll(model.selected), true);
    if (event.key === ' ') return (store.togglePreview(), true);
    if (mod && event.key.toLowerCase() === 'a') return (store.select(pickAll(model.order)), true);
    if (mod && event.key.toLowerCase() === 'd' && model.editable) return (actions.duplicate(model.selected), true);
    if (mod && event.shiftKey && event.key.toLowerCase() === 'n' && model.editable) return (actions.newFolder(), true);
    if (event.key === 'Backspace' || (event.altKey && event.key === 'ArrowUp')) return (model.parentFolder !== null && (store.goTo(model.parentFolder), true));
    if (event.key === 'Escape' && store.query !== '') return (store.setQuery(''), true);
    if (event.key === 'Escape' && model.selected.length > 0) return (store.select({ ids: [], anchor: null }), true);
    return false;
  })();
  if (handled) event.preventDefault();
};

export { useBrowserKeys };
