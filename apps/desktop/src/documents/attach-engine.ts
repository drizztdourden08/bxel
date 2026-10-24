/* @layer renderer-app @kind logic */
import { createEngine } from '@bxel/document';
import type { DocumentEvent, DocumentId, DocumentState } from '@bxel/document';
import { buildView } from './build-view';
import type { HostEntry, HostStore } from './document-host.type';
import { openEvent } from './open-event';
import { publishChange } from './publish-change';
import { publishEvent } from './publish-event';

const attachEngine = (store: HostStore, state: DocumentState, unsaved = false): DocumentId => {
  const engine = createEngine({ state, ids: store.ids.fork(), clock: store.clock, commands: store.commands, limits: store.limits, unsaved });
  const opened = openEvent(state);
  const entry: HostEntry = {
    engine,
    stop: engine.subscribe((event: DocumentEvent) => {
      entry.view = buildView(engine, event);
      publishEvent(store, event);
    }),
    view: buildView(engine, opened),
  };
  store.entries.set(state.documentId, entry);
  publishEvent(store, opened);
  publishChange(store, { kind: 'open', documentId: state.documentId, ids: [...store.entries.keys()] });
  return state.documentId;
};

export { attachEngine };
