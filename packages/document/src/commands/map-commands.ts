/* @layer core @kind logic */
import type { CommandDef } from './command-def.type';
import { mapCopy } from './map/map-copy';
import { mapErase } from './map/map-erase';
import { mapFill } from './map/map-fill';
import { mapLine } from './map/map-line';
import { mapMove } from './map/map-move';
import { mapPaint } from './map/map-paint';
import { mapRect } from './map/map-rect';
import { mapReplace } from './map/map-replace';
import { mapTerrain } from './map/map-terrain';
import { mapWrite } from './map/map-write';
import { mapLayerAdd } from './map-layer/map-layer-add';
import { mapLayerDelete } from './map-layer/map-layer-delete';
import { mapLayerDuplicate } from './map-layer/map-layer-duplicate';
import { mapLayerGroup } from './map-layer/map-layer-group';
import { mapLayerMerge } from './map-layer/map-layer-merge';
import { mapLayerReorder } from './map-layer/map-layer-reorder';
import { mapLayerUngroup } from './map-layer/map-layer-ungroup';
import { mapLayerUpdate } from './map-layer/map-layer-update';

const mapCommands: readonly CommandDef[] = [
  mapLayerAdd,
  mapLayerUpdate,
  mapLayerDelete,
  mapLayerReorder,
  mapLayerDuplicate,
  mapLayerMerge,
  mapLayerGroup,
  mapLayerUngroup,
  mapPaint,
  mapErase,
  mapFill,
  mapRect,
  mapLine,
  mapReplace,
  mapTerrain,
  mapWrite,
  mapCopy,
  mapMove,
];

export { mapCommands };
