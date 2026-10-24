/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';

const cancelPolygon = (): boolean => {
  const { vertices, setVertices } = useSelectionStore.getState();
  if (vertices.length === 0) return false;
  setVertices([]);
  return true;
};

export { cancelPolygon };
