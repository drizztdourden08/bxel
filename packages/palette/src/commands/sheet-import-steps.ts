/* @layer core @kind logic */
import type { CommandStep } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from './palette-command-name.constants';
import { SHEET_IMPORT_ADD_CHUNK, SHEET_IMPORT_REF, SHEET_IMPORT_STEPS } from './sheet-import.constants';
import type { SheetImportCell, SheetImportRequest } from './sheet-import.type';

const cellRef = (index: number): string => `${SHEET_IMPORT_REF}-cell-${index}`;

const importStep = (request: SheetImportRequest, cell: SheetImportCell, index: number): CommandStep => ({
  name: PALETTE_COMMAND_NAME.spriteImport,
  targets: null,
  options: { name: cell.name, image: cell.image, bank: request.bank, ...(cell.mapping ? { mapping: cell.mapping } : {}) },
  ref: cellRef(index),
});

const addStep = (request: SheetImportRequest, from: number): CommandStep => {
  const chunk = request.cells.slice(from, from + SHEET_IMPORT_ADD_CHUNK);
  return {
    name: SHEET_IMPORT_STEPS.add,
    targets: {
      sprites: chunk.map((_, offset) => ({ ref: cellRef(from + offset) })),
      layers: { by: 'all' },
      frames: { by: 'all' },
    },
    options: {
      sheet: { ref: SHEET_IMPORT_REF },
      places: chunk.map((cell) => ({ at: { x: cell.source.x, y: cell.source.y }, source: cell.source })),
    },
  };
};

const sheetImportSteps = (request: SheetImportRequest): CommandStep[] => {
  const create: CommandStep = {
    name: SHEET_IMPORT_STEPS.create,
    targets: null,
    options: { name: request.sheetName, layout: request.layout, spacing: request.spacing, margin: request.margin },
    ref: SHEET_IMPORT_REF,
  };
  const sprites = request.cells.map((cell, index) => importStep(request, cell, index));
  const adds = Array.from({ length: Math.ceil(request.cells.length / SHEET_IMPORT_ADD_CHUNK) }, (_, chunk) =>
    addStep(request, chunk * SHEET_IMPORT_ADD_CHUNK),
  );
  return [create, ...sprites, ...adds];
};

export { sheetImportSteps };
