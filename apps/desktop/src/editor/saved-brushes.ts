/* @layer renderer-app @kind logic */
import type { CustomBrush } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { NO_BRUSHES } from './saved-brushes.constants';

const savedBrushes = (): readonly CustomBrush[] => {
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  return view?.state.artwork.brushes ?? NO_BRUSHES;
};

export { savedBrushes };
