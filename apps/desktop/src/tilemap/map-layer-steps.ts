/* @layer renderer-app @kind logic */
import type { CommandStep, MapLayerId } from '@bxel/document';
import type { MapTarget } from './tilemap.type';

const mapLayerStep = (name: string, target: MapTarget, layer: MapLayerId, extra: Record<string, unknown>): CommandStep => ({
  name,
  targets: null,
  options: { tilemap: target.tilemap.id, layer: { by: 'id', id: layer }, ...extra },
});

export { mapLayerStep };
