/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../../../stores/useNoticeStore';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { setShapes } from '../../../tilemap/set-shapes';
import { setTileData } from '../../../tilemap/set-tile-data';
import { TILESET_TEXT } from '../TilesetPanel.constants';

const commitPaint = (keys: readonly number[]): boolean => {
  const view = useTilesetViewStore.getState();
  if (view.mode === 'data' && view.dataPaint) {
    return setTileData(keys, { data: { [view.dataPaint.field]: view.dataPaint.value } });
  }
  if (view.mode !== 'collision' || view.collisionPaint === 'select') return false;
  const shape = view.collisionPaint === 'full' ? { kind: 'full' as const } : view.lastShape;
  if (!shape) {
    useNoticeStore.getState().post(TILESET_TEXT.noLastShape);
    return false;
  }
  return setShapes(keys, [{ ...shape, layer: view.collisionLayer }], 'layer');
};

export { commitPaint };
