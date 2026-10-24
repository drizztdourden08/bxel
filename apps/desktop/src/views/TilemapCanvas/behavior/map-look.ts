/* @layer renderer-app @kind logic */
import { MAP_TOKENS } from '../TilemapCanvas.constants';
import type { MapLook } from '../TilemapCanvas.type';

const mapLook = (canvas: HTMLCanvasElement): MapLook => {
  const style = canvas.ownerDocument.defaultView?.getComputedStyle(canvas);
  const read = (token: string): string => style?.getPropertyValue(token).trim() ?? '';
  return { cursor: read(MAP_TOKENS.cursor), erase: read(MAP_TOKENS.erase), select: read(MAP_TOKENS.select), collision: read(MAP_TOKENS.collision) };
};

export { mapLook };
