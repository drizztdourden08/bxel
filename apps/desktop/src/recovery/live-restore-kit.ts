/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useFileStore } from '../stores/useFileStore';
import type { RestoreKit } from './recovery.type';
import { recoveryService } from './recovery-service';

const liveRestoreKit = (): RestoreKit => ({
  host: useDocumentStore.getState().host,
  remember: (documentId, path) => useFileStore.getState().remember(documentId, path),
  markRecovered: (documentId) => useFileStore.getState().markRecovered(documentId),
  flush: (documentId) => recoveryService.flush(documentId),
});

export { liveRestoreKit };
