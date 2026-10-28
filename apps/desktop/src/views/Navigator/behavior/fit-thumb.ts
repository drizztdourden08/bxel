/* @layer renderer-app @kind logic */
import type { ThumbBox, ThumbSize } from '../Navigator.type';

const fitThumb = (image: { width: number; height: number }, box: ThumbBox): ThumbSize => {
  const scale = Math.min(box.width / Math.max(1, image.width), box.height / Math.max(1, image.height));
  const safe = Number.isFinite(scale) && scale > 0 ? scale : 1;
  return { width: Math.max(1, Math.round(image.width * safe)), height: Math.max(1, Math.round(image.height * safe)), scale: safe };
};

export { fitThumb };
