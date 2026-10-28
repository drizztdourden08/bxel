/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, MapLayerId } from '@bxel/document';
import { layerRefusalText } from '../editor/layer-refusal-text';
import { runDocument } from '../sheet/run-document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { runSteps } from '../transactions/run-steps';
import { currentMap } from './current-map';
import { mapLayerStep } from './map-layer-steps';
import type { MapLayerFields } from './map-layer-fields.type';
import type { MapTarget } from './tilemap.type';

const mapUpdateSteps = (target: MapTarget, ids: readonly MapLayerId[], fields: MapLayerFields): CommandStep[] =>
  ids.map((id) => mapLayerStep(COMMAND_NAME.mapLayerUpdate, target, id, fields as Record<string, unknown>));

interface MapLayerChange {
  ids: readonly MapLayerId[];
  fields: MapLayerFields;
}

/** Applies several changes to map layers as one undo step. A refusal shows as a notice. */
const changeMapLayers = (changes: readonly MapLayerChange[], label: string): boolean => {
  const target = currentMap();
  const steps = target ? changes.flatMap((change) => mapUpdateSteps(target, change.ids, change.fields)) : [];
  return steps.length > 0 && runDocument(label, steps) !== null;
};

/** Changes the given map layers in one undo step. */
const updateMapLayers = (ids: readonly MapLayerId[], fields: MapLayerFields, label: string): boolean =>
  changeMapLayers([{ ids, fields }], label);

/** Renames a map layer. Returns why it was refused, or null when the name was kept. */
const tryRenameMapLayer = (id: MapLayerId, name: string, label: string): string | null => {
  const target = currentMap();
  const { host, activeId } = useDocumentStore.getState();
  if (!target || activeId === null) return null;
  const result = runSteps(host, activeId, label, mapUpdateSteps(target, [id], { name }));
  return result.ok ? null : layerRefusalText(result.error);
};

export { changeMapLayers, tryRenameMapLayer, updateMapLayers };
