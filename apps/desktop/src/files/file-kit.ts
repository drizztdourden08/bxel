/* @layer renderer-app @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import { ownerPrompts } from '../prompts/owner-prompts';
import { useDocumentStore } from '../stores/useDocumentStore';
import type { FileKit } from './files.type';
import { storePathBook } from './store-path-book';

const fileKit = (): FileKit | null => {
  const { documents } = getPlatform();
  if (!documents) return null;
  const { host, setActive } = useDocumentStore.getState();
  return { documents, prompts: ownerPrompts(documents), host, paths: storePathBook(host), clock: () => Date.now(), focus: setActive };
};

export { fileKit };
