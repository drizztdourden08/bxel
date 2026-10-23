/* @layer renderer-app @kind logic */
import type { DocumentEvent } from '@bxel/document';
import type { HostStore } from './document-host.type';

const publishEvent = (store: HostStore, event: DocumentEvent): void => {
  for (const listener of [...store.listeners]) listener(event);
};

export { publishEvent };
