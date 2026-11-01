/* @layer renderer-app @kind hook */
import { useAssistantPresenceStore } from '../stores/useAssistantPresenceStore';
import { useDocumentStore } from '../stores/useDocumentStore';

const useAssistantLine = (): string | null => {
  const activeId = useDocumentStore((state) => state.activeId);
  return useAssistantPresenceStore((state) => (state.line !== null && state.line.documentId === activeId ? state.line.text : null));
};

export { useAssistantLine };
