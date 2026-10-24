/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Point } from '@bxel/document';
import { chunkCells } from './chunk-cells';
import { layerOptions } from './layer-options';
import type { MapTarget } from './tilemap.type';

const eraseSteps = (target: MapTarget, cells: readonly Point[]): CommandStep[] =>
  chunkCells(cells).map((chunk) => ({
    name: COMMAND_NAME.mapErase,
    targets: null,
    options: { ...layerOptions(target), cells: chunk },
  }));

export { eraseSteps };
