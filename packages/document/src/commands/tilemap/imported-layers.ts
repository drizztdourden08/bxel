/* @layer core @kind logic */
import type { IdSource } from '../../ids/id-source.type';
import type { MapLayerId } from '../../model/ids.type';
import type { MapLayer } from '../../model/tilemap.type';
import type { TilemapImportOptions } from '../../schema/command-options.type';
import { assertNameFree } from '../../validate/assert-name-free';
import { checkName } from '../../validate/check-name';
import { CELL } from '../../tilemap/cell.constants';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const malformed = (cell: number): boolean => (cell & CELL.RESERVED) !== 0 || ((cell & CELL.KEY_MASK) === 0 && cell !== 0);

const importedLayers = (ids: IdSource, layers: TilemapImportOptions['layers'], cellCount: number): MapLayer[] => {
  const taken: string[] = [];
  return layers.map((layer, index) => {
    const name = checkName(layer.name);
    assertNameFree(taken, name);
    taken.push(name);
    const path = `options.layers.${index}.cells`;
    if (layer.cells.length !== cellCount) {
      throw fail(ERROR_CODE.INVALID_OPTION, `Layer "${name}" holds ${layer.cells.length} cells, not ${cellCount}.`, { path });
    }
    if (layer.cells.some(malformed)) {
      throw fail(ERROR_CODE.INVALID_OPTION, `Layer "${name}" holds a cell with a reserved bit or flags but no tile.`, { path });
    }
    return { id: ids.next('tml') as MapLayerId, name, visible: layer.visible, locked: layer.locked, cells: layer.cells.slice() };
  });
};

export { importedLayers };
