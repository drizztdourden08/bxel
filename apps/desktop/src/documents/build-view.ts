/* @layer renderer-app @kind logic */
import type { DocumentEvent, Engine } from '@bxel/document';
import type { DocumentView } from './document-host.type';

const buildView = (engine: Engine, lastEvent: DocumentEvent): DocumentView => {
  const newest = engine.newest();
  return {
    state: engine.state(),
    clean: engine.isClean(),
    canUndo: engine.canUndo(),
    canRedo: engine.canRedo(),
    lastEvent,
    newest: newest === null ? null : { label: newest.label, origin: newest.origin, actor: newest.actor },
  };
};

export { buildView };
