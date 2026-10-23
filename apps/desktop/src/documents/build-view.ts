/* @layer renderer-app @kind logic */
import type { DocumentEvent, Engine } from '@bxel/document';
import type { DocumentView } from './document-host.type';

const buildView = (engine: Engine, lastEvent: DocumentEvent): DocumentView => ({
  state: engine.state(),
  clean: engine.isClean(),
  canUndo: engine.canUndo(),
  canRedo: engine.canRedo(),
  lastEvent,
});

export { buildView };
