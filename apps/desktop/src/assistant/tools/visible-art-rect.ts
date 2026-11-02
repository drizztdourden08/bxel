/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useViewStore } from '../../stores/useViewStore';
import type { ArtRect } from './render-overlay.type';

const visibleArtRect = (documentId: string, art: { readonly width: number; readonly height: number }): ArtRect | null => {
  const { viewport } = useViewStore.getState();
  if (!viewport || useDocumentStore.getState().activeId !== documentId) return null;
  const view = viewport.view();
  if (view.imageWidth !== art.width || view.imageHeight !== art.height) return null;
  const halfWidth = view.width / 2 / view.zoom;
  const halfHeight = view.height / 2 / view.zoom;
  const x = Math.max(0, Math.floor(view.pan.x - halfWidth));
  const y = Math.max(0, Math.floor(view.pan.y - halfHeight));
  const right = Math.min(view.imageWidth, Math.ceil(view.pan.x + halfWidth));
  const bottom = Math.min(view.imageHeight, Math.ceil(view.pan.y + halfHeight));
  return right > x && bottom > y ? { x, y, width: right - x, height: bottom - y } : null;
};

export { visibleArtRect };
