/* @layer renderer-app @kind logic */
import type { CustomBrush } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';

const NO_BRUSHES: readonly CustomBrush[] = [];

const savedBrushes = (): readonly CustomBrush[] => {
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  return view?.state.artwork.brushes ?? NO_BRUSHES;
};

const savedBrush = (id: string | null): CustomBrush | null => (id === null ? null : (savedBrushes().find((brush) => brush.id === id) ?? null));

export { savedBrush, savedBrushes };
