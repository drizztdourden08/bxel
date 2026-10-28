/* @layer renderer-app @kind logic */
import { runDocument } from '../sheet/run-document';
import { currentMap } from './current-map';
import { mapUpdateSteps } from './map-update-steps';
import type { MapLayerChange } from './update-map-layers.type';

const changeMapLayers = (changes: readonly MapLayerChange[], label: string): boolean => {
  const target = currentMap();
  const steps = target ? changes.flatMap((change) => mapUpdateSteps(target, change.ids, change.fields)) : [];
  return steps.length > 0 && runDocument(label, steps) !== null;
};

export { changeMapLayers };
