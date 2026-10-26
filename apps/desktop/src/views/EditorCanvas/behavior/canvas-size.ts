/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/raster';
import type { EditorTarget } from '../../../editor/editor.type';

const canvasSize = (preview: ImageData | null, outcome: Size | null | undefined, target: EditorTarget | null): Size => {
  const shown = preview ?? outcome ?? target?.sprite;
  return { width: shown?.width ?? 1, height: shown?.height ?? 1 };
};

export { canvasSize };
