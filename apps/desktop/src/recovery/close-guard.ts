/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useFileStore } from '../stores/useFileStore';
import { dirtyNames } from './dirty-names';
import { RECOVERY_TEXT } from './recovery.constants';
import { recoveryService } from './recovery-service';

const closeGuard = (): string | undefined => {
  const { views, order } = useDocumentStore.getState();
  const names = dirtyNames(views, order, (documentId) => useFileStore.getState().paths[documentId]);
  if (names.length === 0) return undefined;
  void recoveryService.flush();
  return RECOVERY_TEXT.closePrompt(names.join(', '));
};

export { closeGuard };
