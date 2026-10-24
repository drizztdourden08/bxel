/* @layer core @kind logic */
import { DEFAULT_HISTORY_LIMITS } from '../history/history-limits.constants';
import { emptyHistory } from '../history/empty-history';
import { buildRegistry } from './build-registry';
import type { Engine, EngineOptions, EngineStore } from './engine.type';
import { executeTransaction } from './execute-transaction';
import { markSaved } from './mark-saved';
import { stepHistory } from './step-history';

const createEngine = (options: EngineOptions): Engine => {
  const store: EngineStore = {
    documentId: options.state.documentId,
    readOnly: options.state.readOnly,
    registry: buildRegistry(options.commands),
    limits: options.limits ?? DEFAULT_HISTORY_LIMITS,
    listeners: new Set(),
    revision: options.state.revision,
    artwork: options.state.artwork,
    ids: options.ids,
    history: options.unsaved === true ? { ...emptyHistory(), savedCursor: null } : emptyHistory(),
    nextEntryId: 1,
  };
  return {
    documentId: store.documentId,
    state: () => ({
      documentId: store.documentId,
      revision: store.revision,
      artwork: store.artwork,
      readOnly: store.readOnly,
    }),
    execute: (request) => executeTransaction(store, request),
    undo: (request) => stepHistory({ store, request, direction: 'undo' }),
    redo: (request) => stepHistory({ store, request, direction: 'redo' }),
    subscribe: (listener) => {
      store.listeners.add(listener);
      return () => {
        store.listeners.delete(listener);
      };
    },
    canUndo: () => store.history.cursor > 0,
    canRedo: () => store.history.cursor < store.history.entries.length,
    isClean: () => store.history.savedCursor === store.history.cursor,
    markSaved: () => {
      markSaved(store);
    },
  };
};

export { createEngine };
