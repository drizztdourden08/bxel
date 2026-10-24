/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { chunkCells } from './chunk-cells';
import { layerOptions } from './layer-options';
import type { MapTarget, PlacementGroup } from './tilemap.type';

const paintSteps = (target: MapTarget, groups: readonly PlacementGroup[]): CommandStep[] =>
  groups.flatMap((group) =>
    chunkCells(group.cells).map((cells) => ({
      name: COMMAND_NAME.mapPaint,
      targets: null,
      options: { ...layerOptions(target), cells, tile: group.key, flags: group.flags },
    })),
  );

export { paintSteps };
