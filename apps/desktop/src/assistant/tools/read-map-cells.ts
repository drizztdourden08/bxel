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

const rectPart = (map: Tilemap, layer: MapLayer, rect: ReadMapCellsInput['rect']) => {
  if (!rect) return {};
  const cells = rectCells(map, layer, rect);
  return { rect, keys: cells.map(cellKey), flags: cells.map(flagBitsOf) };
};

const refusal = (map: Tilemap, input: ReadMapCellsInput) => {
  const { rect, mask } = input;
  if (!rect && !mask) return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.needRectOrMask, { path: 'rect' });
  const outside = rect !== undefined && (rect.x + rect.width > map.columns || rect.y + rect.height > map.rows);
  return outside ? mcpFailure(ERROR_CODE.OUT_OF_BOUNDS, TOOL_TEXT.outsideMap, { path: 'rect' }) : null;
};

const readMapCells: ToolHandler = (input, context) => {
  const asked = input as ReadMapCellsInput;
  const view = viewFor(context, asked.documentId);
  if (!view) return reply(hiddenFailure('document'));
  const map = mapFor(view.state.artwork, asked.tilemapId, hiddenAssets(context, asked.documentId));
  const layer = map?.layers.find((candidate) => candidate.id === asked.layerId);
  if (!map || !layer) return reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noMap, { path: 'tilemapId' }));
  const refused = refusal(map, asked);
  if (refused) return reply(refused);
  return reply({
    ok: true,
    revision: view.state.revision,
    ...rectPart(map, layer, asked.rect),
    ...(asked.mask ? { selected: selectedMapCells(map, layer, asked.mask) } : {}),
  });
};

export { readMapCells };
