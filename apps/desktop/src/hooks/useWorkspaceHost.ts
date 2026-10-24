/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useDocumentStore } from '../stores/useDocumentStore';
import { onHostChange } from '../workspace/on-host-change';
import { watchWorkspaces } from '../workspace/watch-workspaces';

const useWorkspaceHost = (): void =>
  useEffect(() => {
    const stop = watchWorkspaces();
    const { host } = useDocumentStore.getState();
    const ids = host.list();
    for (const documentId of ids) onHostChange({ kind: 'open', documentId, ids });
    return stop;
  }, []);

export { useWorkspaceHost };
