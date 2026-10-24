/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { useSelectionStore } from '../../stores/useSelectionStore';

const addVertex = (at: Point): void => {
  const { vertices, setVertices } = useSelectionStore.getState();
  const last = vertices.at(-1);
  if (last?.x !== at.x || last.y !== at.y) setVertices([...vertices, at]);
};

export { addVertex };
