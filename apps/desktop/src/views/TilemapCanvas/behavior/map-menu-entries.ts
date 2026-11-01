/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { viewEntries } from '../../../context-menu/view-entries';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { SELECTION_COMMAND_ID } from '../../../keymap/selection-command-id.constants';
import { TILEMAP_COMMAND as ID } from '../../../keymap/tilemap-command-id.constants';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { cellKeyAt } from '../../../tilemap/cell-key-at';
import { pickedKey } from '../../../tilemap/picked-key';
import { topLayerAt } from '../../../tilemap/top-layer-at';
import type { MapTarget } from '../../../tilemap/tilemap.type';
import { guideHereEntries } from '../../EditorCanvas/behavior/guide-here-entries';
import { MAP_MENU } from '../TilemapCanvas.constants';
import type { MapWhere } from '../TilemapCanvas.type';
import { mapSubmenuEntries } from './map-submenu-entries';

const mapMenuEntries = (target: MapTarget, where: MapWhere): readonly ContextMenuEntry[] => {
  const { cell: here, pixel } = where;
  const cells = useTilemapStore.getState().selection !== null;
  const cell = here === null ? null : cellKeyAt(here);
  const layered = here !== null && topLayerAt(target.tilemap, here) !== null;
  const args = { x: here?.x, y: here?.y };
  const needCells = unless(cells, MAP_MENU.needCells);
  const needTile = unless(pickedKey() !== null, MAP_MENU.needTile);
  return [
    { command: 'tilemap.pick_tile_here', label: MAP_MENU.pickHere, args, ...unless(cell !== null, MAP_MENU.emptyCell) },
    { command: 'tilemap.pick_layer_here', label: MAP_MENU.pickLayer, args, ...unless(layered, MAP_MENU.noTileLayer) },
    { command: 'tilemap.edit_tile_here', label: MAP_MENU.editHere, args, ...unless(cell !== null, MAP_MENU.emptyCell) },
    {
      label: MAP_MENU.turn,
      disabled: !cells,
      items: [ID.flipX, ID.flipY, ID.turn],
    },
    { command: ID.replaceSelection, ...(cells ? needTile : needCells) },
    { command: ID.replaceEverywhere, ...needTile },
    { command: ID.makeUnique, ...needCells },
    'separator',
    SELECTION_COMMAND_ID.selectAll,
    { command: SELECTION_COMMAND_ID.clear, ...needCells },
    { command: ID.selectSame, ...needCells },
    { command: ID.captureStamp, ...needCells },
    { command: COMMAND_ID.zoomSelection, ...needCells },
    mapSubmenuEntries(target),
    guideHereEntries(pixel),
    viewEntries({ major: false, tile: true, tiled: false, guides: true }),
    'separator',
    { command: ID.clearCells, tone: 'danger', ...needCells },
  ];
};

export { mapMenuEntries };
