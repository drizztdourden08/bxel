/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { announceEdit } from '../assistant-presence/announce-edit';
import { useDocumentStore } from '../stores/useDocumentStore';

const useAssistantPresence = (): void => {
  useEffect(() => useDocumentStore.getState().host.subscribe(announceEdit), []);
};

export { useAssistantPresence };
