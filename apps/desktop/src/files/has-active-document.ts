/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';

const hasActiveDocument = (): boolean => useDocumentStore.getState().activeId !== null;

export { hasActiveDocument };
