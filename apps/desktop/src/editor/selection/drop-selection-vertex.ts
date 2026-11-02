/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';

const dropSelectionVertex = (): boolean => {
  const { variant, vertices, setVertices } = useSelectionStore.getState();
  if (variant !== 'polygon' || vertices.length === 0) return false;
  setVertices(vertices.slice(0, -1));
  return true;
};

export { dropSelectionVertex };
