/* @layer core @kind logic */
import type { EngineStore } from './engine.type';
import type { DocumentEvent } from './event.type';

const notify = (store: EngineStore, event: DocumentEvent): void => {
  for (const listener of [...store.listeners]) listener(event);
};

export { notify };
