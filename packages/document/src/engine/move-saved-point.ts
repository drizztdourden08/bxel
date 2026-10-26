/* @layer core @kind logic */
import { DEFAULT_ACTOR } from '../commands/actor.constants';
import { emptyChanges } from './empty-changes';
import type { EngineStore } from './engine.type';
import { notify } from './notify';

const moveSavedPoint = (store: EngineStore, savedCursor: number | null, label: string): void => {
  store.history = { ...store.history, savedCursor };
  notify(store, {
    kind: 'save',
    documentId: store.documentId,
    revision: store.revision,
    previousRevision: store.revision,
    label,
    origin: 'ui',
    actor: DEFAULT_ACTOR,
    changes: emptyChanges(),
  });
};

export { moveSavedPoint };
