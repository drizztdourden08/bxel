/* @layer renderer-app @kind logic */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { addToAnimation } from '../../../asset-list/add-to-animation';
import { applyPaletteRow } from '../../../asset-list/apply-palette-row';
import type { AssetRow } from '../../../asset-list/asset-list.type';
import { importAsTiles } from '../../../asset-list/import-as-tiles';
import { newTilemapFrom } from '../../../asset-list/new-tilemap-from';
import { openImage } from '../../../asset-list/open-image';
import { openMapTileset } from '../../../asset-list/open-map-tileset';
import { openSheetSprites } from '../../../asset-list/open-sheet-sprites';
import { splitLegacyItem } from '../../../asset-list/split-legacy-item';
import { unpackProjectFile } from '../../../asset-list/unpack-project-file';
import { runFileAction } from '../../../files/run-file-action';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { PROJECT_GROUP } from '../../../project/project.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { commandTargets } from './command-targets';
import { spriteIdsOf } from './sprite-ids-of';

const onItem = (model: ProjectPanelModel, run: (item: BrowserItem) => void) => (context?: CommandContext): void => {
  const item = commandTargets(model, context)[0];
  if (item) run(item);
};

const onRow = (model: ProjectPanelModel, run: (row: AssetRow) => void) =>
  onItem(model, (item) => {
    if (item.row?.loaded) run(item.row);
  });

const openInHub = async (model: ProjectPanelModel, path: string): Promise<void> => {
  await runFileAction({ kind: 'openPath', path });
  model.openHub();
};

const assetKindCommands = (model: ProjectPanelModel): readonly CommandDef[] => [
  { id: 'asset.add_to_animation', label: 'Add a sprite to the open animation', group: PROJECT_GROUP, run: (context?: CommandContext) => addToAnimation(spriteIdsOf(commandTargets(model, context))) },
  { id: 'asset.apply_palette', label: 'Apply a palette to the open asset', group: PROJECT_GROUP, run: onRow(model, applyPaletteRow) },
  { id: 'asset.new_tilemap_from', label: 'New tilemap from a tileset', group: PROJECT_GROUP, run: onRow(model, newTilemapFrom) },
  { id: 'asset.open_sprites', label: 'Open the sprites of a sheet', group: PROJECT_GROUP, run: onRow(model, openSheetSprites) },
  { id: 'asset.open_tileset', label: 'Open the tileset of a tilemap', group: PROJECT_GROUP, run: onRow(model, openMapTileset) },
  { id: 'asset.split_legacy', label: 'Split an older file into files', group: PROJECT_GROUP, run: onItem(model, (item) => void splitLegacyItem(item.path)) },
  { id: 'asset.unpack_project', label: 'Unpack a packed project', group: PROJECT_GROUP, run: onItem(model, (item) => void unpackProjectFile(item.path)) },
  { id: 'asset.open_in_hub', label: 'Open a project file in the Project hub', group: PROJECT_GROUP, run: onItem(model, (item) => void openInHub(model, item.path)) },
  { id: 'asset.import_as_sprite', label: 'Import an image as a sprite', group: PROJECT_GROUP, run: onItem(model, (item) => void openImage(item.path)) },
  { id: 'asset.import_as_tileset', label: 'Import an image into the open tileset', group: PROJECT_GROUP, run: onItem(model, (item) => void importAsTiles(item.path)) },
];

export { assetKindCommands };
