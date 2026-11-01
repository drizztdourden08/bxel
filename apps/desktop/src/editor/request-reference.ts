/* @layer renderer-app @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import { decodeSource } from '../image-import/decode-source';
import { useReferenceStore } from '../stores/useReferenceStore';
import { requestedReferences } from './requested-references';

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
  if (requestedReferences.has(path)) return;
  requestedReferences.add(path);
  void load(path);
};

export { requestReference };
