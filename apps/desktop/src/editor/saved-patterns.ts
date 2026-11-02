/* @layer renderer-app @kind logic */
import type { SavedPattern } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { NO_PATTERNS } from './saved-patterns.constants';

const savedPatterns = (): readonly SavedPattern[] => {
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  return view?.state.artwork.patterns ?? NO_PATTERNS;
};

export { savedPatterns };
