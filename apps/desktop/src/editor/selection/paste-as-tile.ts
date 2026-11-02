/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { runDocument } from '../../sheet/run-document';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { useSelectionStore } from '../../stores/useSelectionStore';
import { currentTileset } from '../../tilemap/current-tileset';
import { pickTile } from '../../tilemap/pick-tile';
import { TILE_REF, TILEMAP_TEXT } from '../../tilemap/tilemap.constants';
import { fitClip } from './fit-clip';
import { SELECTION_LABELS, SELECTION_TEXT } from './selection.constants';

const pasteAsTile = (): boolean => {
  const clip = useSelectionStore.getState().clipboard;
  const tileset = currentTileset();
  if (!tileset) {
    useNoticeStore.getState().post(TILEMAP_TEXT.noTileset);
    return false;
  }
  if (!clip) {
    useNoticeStore.getState().post(SELECTION_TEXT.nothingToPaste);
    return false;
  }
  const fitted = fitClip(clip, { width: tileset.tileWidth, height: tileset.tileHeight });
  const { width, height, pixels } = fitted.clip;
  const steps: CommandStep[] = [
    { name: COMMAND_NAME.tileAdd, targets: null, options: { tileset: tileset.id }, ref: TILE_REF.tile },
    {
      name: COMMAND_NAME.pixelsPatch,
      targets: { sprites: [{ ref: TILE_REF.tile }], layers: { by: 'all' }, frames: { by: 'all' } },
      options: { rect: { x: 0, y: 0, width, height }, pixels, skipZero: true },
    },
  ];
  if (fitted.cropped) useNoticeStore.getState().post(SELECTION_TEXT.pastedCropped);
  const done = runDocument(SELECTION_LABELS.pasteTile, steps);
  const made = currentTileset()?.tiles.find((tile) => tile.spriteId === done?.created[TILE_REF.tile]);
  return made !== undefined && pickTile(made.key);
};

export { pasteAsTile };
