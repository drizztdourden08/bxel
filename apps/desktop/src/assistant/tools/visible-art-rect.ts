/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useViewStore } from '../../stores/useViewStore';
import type { ArtRect } from './render-overlay.type';
import { viewArtBounds } from './view-art-bounds';

const visibleArtRect = (documentId: string, art: { readonly width: number; readonly height: number }): ArtRect | null => {
  const { viewport } = useViewStore.getState();
  if (!viewport || useDocumentStore.getState().activeId !== documentId) return null;
  const view = viewport.view();
  if (view.imageWidth !== art.width || view.imageHeight !== art.height) return null;
  const { x, y, right, bottom } = viewArtBounds(view);
  return right > x && bottom > y ? { x, y, width: right - x, height: bottom - y } : null;
};

export { visibleArtRect };
