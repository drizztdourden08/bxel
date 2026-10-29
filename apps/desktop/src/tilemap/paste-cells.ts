/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';
import { placeClip } from './place-clip';
import { readSystemCells } from './read-system-cells';
import { CELL_CLIP_TEXT } from './tilemap.constants';

const pasteCells = async (inPlace: boolean): Promise<boolean> => {
  const store = useTilemapStore.getState();
  const held = await readSystemCells();
  if (held) store.setClip(held);
  const { clip } = useTilemapStore.getState();
  const target = currentMap();
  if (!clip) {
    useNoticeStore.getState().post(CELL_CLIP_TEXT.noCells);
    return false;
  }
  if (!target) return false;
  if (clip.tilesetId !== target.tileset.id) {
    useNoticeStore.getState().post(CELL_CLIP_TEXT.otherTileset);
    return false;
  }
  if (inPlace) return placeClip(clip, clip.origin);
  store.setPaste(clip);
  return true;
};

export { pasteCells };
