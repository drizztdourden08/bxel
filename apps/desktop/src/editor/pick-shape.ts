/* @layer renderer-app @kind logic */
import type { ShapeKind } from '@bxel/raster';
import { useToolStore } from '../stores/useToolStore';

const pickShape = (kind: ShapeKind): void => {
  const tools = useToolStore.getState();
  tools.setShape(kind);
  if (tools.tool !== 'shape') tools.selectTool('shape');
};

export { pickShape };
