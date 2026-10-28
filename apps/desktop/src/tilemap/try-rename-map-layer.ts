/* @layer renderer-app @kind logic */
import type { MapLayerId } from '@bxel/document';
import { layerRefusalText } from '../editor/layer-refusal-text';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';
import { currentMap } from './current-map';
import { mapUpdateSteps } from './map-update-steps';

const tryRenameMapLayer = (id: MapLayerId, name: string, label: string): string | null => {
  const target = currentMap();
  const { host, activeId } = useDocumentStore.getState();
  if (!target || activeId === null) return null;
  const result = runSteps(host, activeId, label, mapUpdateSteps(target, [id], { name }));
  return result.ok ? null : layerRefusalText(result.error);
};

export { tryRenameMapLayer };
