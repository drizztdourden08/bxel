/* @layer renderer-app @kind logic */
import { cellKey, ERROR_CODE, flagBitsOf } from '@bxel/document';
import { hiddenFailure, mcpFailure } from '@bxel/mcp';
import type { ToolHandler } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { mapFor } from './map-for';
import { reply } from './reply';
import type { ReadMapCellsInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';

const readMapCells: ToolHandler = (input, context) => {
  const { documentId, tilemapId, layerId, rect } = input as ReadMapCellsInput;
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  const map = mapFor(view.state.artwork, tilemapId, hiddenAssets(context, documentId));
  const layer = map?.layers.find((candidate) => candidate.id === layerId);
  if (!map || !layer) return reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noMap, { path: 'tilemapId' }));
  if (rect.x + rect.width > map.columns || rect.y + rect.height > map.rows) {
    return reply(mcpFailure(ERROR_CODE.OUT_OF_BOUNDS, TOOL_TEXT.outsideMap, { path: 'rect' }));
  }
  const cells: number[] = [];
  for (let row = rect.y; row < rect.y + rect.height; row += 1) {
    for (let column = rect.x; column < rect.x + rect.width; column += 1) cells.push(layer.cells[row * map.columns + column] ?? 0);
  }
  return reply({ ok: true, revision: view.state.revision, rect, keys: cells.map(cellKey), flags: cells.map(flagBitsOf) });
};

export { readMapCells };
