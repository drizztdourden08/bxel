/* @layer renderer-app @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import { decodeSource } from '../image-import/decode-source';
import { useReferenceStore } from '../stores/useReferenceStore';

const requested = new Set<string>();

const load = async (path: string): Promise<void> => {
  const { settle } = useReferenceStore.getState();
  try {
    const documents = getPlatform().documents;
    const decoded = documents ? decodeSource(await documents.read(path)) : null;
    settle(path, decoded === null ? { state: 'missing' } : { state: 'ready', picture: decoded });
  } catch {
    settle(path, { state: 'missing' });
  }
};

const requestReference = (path: string): void => {
  if (requested.has(path)) return;
  requested.add(path);
  void load(path);
};

const forgetReference = (path: string): void => {
  requested.delete(path);
  useReferenceStore.getState().forget(path);
};

export { forgetReference, requestReference };
