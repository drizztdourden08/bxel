/* @layer renderer-app @kind logic */
import { decodeBrushPixels } from '@bxel/document';
import type { DrawingSettings } from '../stores/drawing-store.type';
import type { BrushPatch } from './editor.type';
import { savedBrush } from './saved-brush';

const brushPatch = (drawing: DrawingSettings, index: number): BrushPatch | null => {
  const brush = savedBrush(drawing.brushId);
  if (!brush) return null;
  const pixels = decodeBrushPixels(brush.pixels);
  const stencil = drawing.brushMode === 'stencil';
  return {
    patch: { width: brush.width, height: brush.height, pixels: stencil ? pixels.map((value) => (value === 0 ? 0 : index)) : pixels },
    brushId: stencil ? null : brush.id,
    flipX: drawing.brushFlipX,
    flipY: drawing.brushFlipY,
    turn: drawing.brushTurn,
  };
};

export { brushPatch };
