/* @layer renderer-app @kind logic */
import type { HostChange, HostStore } from './document-host.type';

const publishChange = (store: HostStore, change: HostChange): void => {
  for (const listener of [...store.changeListeners]) listener(change);
};

export { publishChange };
