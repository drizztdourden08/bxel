/* @layer renderer-app @kind logic */
import { cellKey, ERROR_CODE, flagBitsOf } from '@bxel/document';
import type { MapLayer, Tilemap } from '@bxel/document';
import { hiddenFailure, mcpFailure } from '@bxel/mcp';
import type { ToolHandler } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { mapFor } from './map-for';
import { reply } from './reply';
import { selectedMapCells } from './selected-map-cells';
import type { ReadMapCellsInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';

const rectCells = (map: Tilemap, layer: MapLayer, rect: NonNullable<ReadMapCellsInput['rect']>): number[] => {
  const cells: number[] = [];
  for (let row = rect.y; row < rect.y + rect.height; row += 1) {
    for (let column = rect.x; column < rect.x + rect.width; column += 1) cells.push(layer.cells[row * map.columns + column] ?? 0);
  }
  return cells;
};

const readMapCells: ToolHandler = (input, context) => {
  const { documentId, tilemapId, layerId, rect, mask } = input as ReadMapCellsInput;
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  if (!rect && !mask) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.needRectOrMask, { path: 'rect' }));
  const map = mapFor(view.state.artwork, tilemapId, hiddenAssets(context, documentId));
  const layer = map?.layers.find((candidate) => candidate.id === layerId);
  if (!map || !layer) return reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noMap, { path: 'tilemapId' }));
  if (rect && (rect.x + rect.width > map.columns || rect.y + rect.height > map.rows)) {
    return reply(mcpFailure(ERROR_CODE.OUT_OF_BOUNDS, TOOL_TEXT.outsideMap, { path: 'rect' }));
  }
  const cells = rect ? rectCells(map, layer, rect) : [];
  return reply({
    ok: true,
    revision: view.state.revision,
    ...(rect ? { rect, keys: cells.map(cellKey), flags: cells.map(flagBitsOf) } : {}),
    ...(mask ? { selected: selectedMapCells(map, layer, mask) } : {}),
  });
};

export { readMapCells };
