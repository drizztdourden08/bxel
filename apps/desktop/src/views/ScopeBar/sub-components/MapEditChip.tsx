/* @layer renderer-app @kind component */
import { tileUseCounts } from '@bxel/document';
import { Tag } from '@drizztdourden08/tessera';
import { useMapContext } from '../../../hooks/useMapContext';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { MAP_TEXT } from '../ScopeBar.constants';

const MapEditChip = () => {
  const context = useMapContext();
  const editKey = useTilemapStore((state) => state.editKey);
  const uses = context?.tileset && editKey !== null ? (tileUseCounts(context.artwork, context.tileset.id).get(editKey) ?? 0) : 0;
  return (
    <Tag variant="urgency" color="warning">
      {editKey === null ? MAP_TEXT.editingNone : MAP_TEXT.editing(editKey, uses)}
    </Tag>
  );
};

export { MapEditChip };
