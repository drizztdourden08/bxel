/* @layer renderer-app @kind component */
import { tileUseCounts } from '@bxel/document';
import { Tag } from '@drizztdourden08/tessera';
import { useMapContext } from '../../../hooks/useMapContext';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { TILE_BAR_TEXT } from './TileBar.constants';

const MapEditChip = () => {
  const context = useMapContext();
  const editKey = useTilemapStore((state) => state.editKey);
  const uses = context?.tileset && editKey !== null ? (tileUseCounts(context.artwork, context.tileset.id).get(editKey) ?? 0) : 0;
  return (
    <Tag variant="urgency" color="warning">
      {editKey === null ? TILE_BAR_TEXT.editingNone : TILE_BAR_TEXT.editing(editKey, uses)}
    </Tag>
  );
};

export { MapEditChip };
