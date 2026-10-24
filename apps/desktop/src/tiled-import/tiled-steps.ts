/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { alphaThreshold } from '../image-import/alpha-threshold';
import type { BankOption, ImportRun } from '../image-import/image-import.type';
import { freeName } from '../sheet/free-name';
import { layerNames } from './layer-names';
import { atlasOrigin } from './atlas-origin';
import { orientRequest } from './orient-request';
import { TILED_REF } from './tiled-import.constants';

const tiledSteps = (run: ImportRun, bank: BankOption): CommandStep[] => {
  const { tiled, form, context } = run;
  if (!tiled) return [];
  const { plan } = tiled;
  const inFile = form.target === 'file';
  const tilesetName = freeName(plan.tileset, inFile ? context.tilesetNames : []);
  const names = layerNames(plan.layers.map((layer) => layer.name));
  const tiles = plan.tiles.map((tile, at) => ({
    image: { width: tile.image.width, height: tile.image.height, rgba: Uint8Array.from(tile.image.data) },
    originX: atlasOrigin(at, tiled.atlasColumns, plan).x,
    originY: atlasOrigin(at, tiled.atlasColumns, plan).y,
    ...(tile.collision ? { collision: tile.collision } : {}),
  }));
  return [
    {
      name: PALETTE_COMMAND_NAME.tilesetImport,
      targets: null,
      ref: TILED_REF.tileset,
      options: {
        name: tilesetName,
        tileWidth: plan.tileWidth,
        tileHeight: plan.tileHeight,
        bank,
        mapping: { dither: form.dither, alphaThreshold: alphaThreshold(form.alphaPercent) },
        tiles,
      },
    },
    {
      name: COMMAND_NAME.tilemapImport,
      targets: null,
      ref: TILED_REF.tilemap,
      options: {
        name: form.name.trim(),
        tileset: { ref: TILED_REF.tileset },
        columns: plan.columns,
        rows: plan.rows,
        ...(orientRequest(plan) ? { orientation: orientRequest(plan) } : {}),
        layers: plan.layers.map((layer, at) => ({ name: names[at] ?? layer.name, visible: layer.visible, locked: layer.locked, cells: layer.cells })),
      },
    },
  ];
};

export { tiledSteps };
