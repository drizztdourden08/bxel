/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, MapLayerId } from '@bxel/document';
import { mapLayerStep } from './map-layer-steps';
import type { MapLayerFields } from './map-layer-fields.type';
import type { MapTarget } from './tilemap.type';

const mapUpdateSteps = (target: MapTarget, ids: readonly MapLayerId[], fields: MapLayerFields): CommandStep[] =>
  ids.map((id) => mapLayerStep(COMMAND_NAME.mapLayerUpdate, target, id, fields as Record<string, unknown>));

export { mapUpdateSteps };
