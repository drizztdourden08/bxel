/* @layer renderer-app @kind hook */
import { NO_BRUSHES } from '../editor/saved-brushes.constants';
import { NO_PATTERNS } from '../editor/saved-patterns.constants';
import { useDocumentStore } from '../stores/useDocumentStore';
import type { SavedLibrary } from './use-saved-library.type';

const useSavedLibrary = (): SavedLibrary => {
  const brushes = useDocumentStore((state) => (state.activeId === null ? NO_BRUSHES : (state.views[state.activeId]?.state.artwork.brushes ?? NO_BRUSHES)));
  const patterns = useDocumentStore((state) => (state.activeId === null ? NO_PATTERNS : (state.views[state.activeId]?.state.artwork.patterns ?? NO_PATTERNS)));
  return { brushes, patterns };
};

export { useSavedLibrary };
