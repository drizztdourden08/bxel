/* @layer renderer-app @kind logic */
import type { ImageSize, ViewBox } from './viewport.type';

const fitZoom = (image: ImageSize, box: ViewBox): number => {
  const raw = Math.min(box.width / image.width, box.height / image.height);
  if (!Number.isFinite(raw) || raw <= 0) return 1;
  return raw >= 1 ? Math.floor(raw) : raw;
};

export { fitZoom };
