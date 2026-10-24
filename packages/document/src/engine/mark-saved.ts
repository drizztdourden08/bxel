/* @layer core @kind logic */
import { DEFAULT_ACTOR } from '../commands/actor.constants';
import { emptyChanges } from './empty-changes';
import type { EngineStore } from './engine.type';
import { notify } from './notify';

const markSaved = (store: EngineStore): void => {
  store.history = { ...store.history, savedCursor: store.history.cursor };
  notify(store, {
    kind: 'save',
    documentId: store.documentId,
    revision: store.revision,
    previousRevision: store.revision,
    label: 'Save',
    origin: 'ui',
    actor: DEFAULT_ACTOR,
    changes: emptyChanges(),
  });
};

export { markSaved };
