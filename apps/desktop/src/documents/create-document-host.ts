/* @layer renderer-app @kind logic */
import { projectCreate } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import { attachEngine } from './attach-engine';
import { browserIdSource } from './browser-id-source';
import { closeEntry } from './close-entry';
import { APP_COMMANDS } from './document-host.constants';
import type { DocumentHost, DocumentHostOptions, HostStore } from './document-host.type';
import { missingDocument } from './missing-document';
import { runHistory } from './run-history';
import { subscribeTo } from './subscribe-to';

const createDocumentHost = (options: DocumentHostOptions = {}): DocumentHost => {
  const store: HostStore = {
    ids: options.ids ?? browserIdSource(),
    commands: options.commands ?? APP_COMMANDS,
    limits: options.limits,
    entries: new Map(),
    listeners: new Set(),
    changeListeners: new Set(),
  };
  return {
    create: (createOptions) => {
      const created = projectCreate({ options: createOptions, ids: store.ids });
      if (!created.ok) return { ok: false, error: created.error };
      return { ok: true, documentId: attachEngine(store, created.state) };
    },
    open: ({ project, readOnly, unsaved }) =>
      attachEngine(store, { documentId: store.ids.next('doc') as DocumentId, revision: 1, project, readOnly }, unsaved === true),
    close: (documentId) => closeEntry(store, documentId),
    list: () => [...store.entries.keys()],
    view: (documentId) => store.entries.get(documentId)?.view ?? null,
    execute: (request) => {
      const entry = store.entries.get(request.documentId);
      return entry ? entry.engine.execute(request) : missingDocument(request.documentId, request.baseRevision);
    },
    undo: (documentId) => runHistory(store, documentId, 'undo'),
    redo: (documentId) => runHistory(store, documentId, 'redo'),
    markSaved: (documentId) => {
      const entry = store.entries.get(documentId);
      entry?.engine.markSaved();
      return entry !== undefined;
    },
    subscribe: (listener) => subscribeTo(store.listeners, listener),
    watch: (documentId, listener) =>
      subscribeTo(store.listeners, (event) => {
        if (event.documentId === documentId) listener(event);
      }),
    subscribeChanges: (listener) => subscribeTo(store.changeListeners, listener),
  };
};

export { createDocumentHost };
