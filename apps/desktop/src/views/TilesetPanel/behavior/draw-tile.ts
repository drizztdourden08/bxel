/* @layer renderer-app @kind logic */
import { THUMB_BOX } from '../TilesetPanel.constants';

const drawTile = (element: HTMLCanvasElement, source: HTMLCanvasElement | null): void => {
  const ctx = element.getContext('2d');
  element.width = THUMB_BOX;
  element.height = THUMB_BOX;
  if (!ctx || !source) return;
  const fit = THUMB_BOX / Math.max(source.width, source.height);
  const scale = fit >= 1 ? Math.floor(fit) : fit;
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, Math.floor((THUMB_BOX - width) / 2), Math.floor((THUMB_BOX - height) / 2), width, height);
};

export { drawTile };
